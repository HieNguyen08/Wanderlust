
package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Formatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.dto.payment.RefundRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletRefundRequestDTO;
import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.mapper.PaymentMapper;
import com.wanderlust.api.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final WalletService walletService; 
    private final BookingService bookingService; 
    
    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt");

    @Value("${momo.partner-code}")
    private String momoPartnerCode;

    @Value("${momo.access-key}")
    private String momoAccessKey;

    @Value("${momo.secret-key}")
    private String momoSecretKey;

    @Value("${momo.endpoint}")
    private String momoEndpoint;

    @Value("${momo.ipn-url}")
    private String momoIpnUrl;

    @Value("${momo.redirect-url}")
    private String momoRedirectUrl;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    public List<PaymentDTO> findAll() {
        return paymentMapper.toDTOs(paymentRepository.findAll(defaultSort));
    }
    public PaymentDTO findById(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
        return paymentMapper.toDTO(payment);
    }
    public List<PaymentDTO> findByUserId(String userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId, defaultSort);
        return paymentMapper.toDTOs(payments);
    }
    public PaymentDTO findByBookingId(String bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id " + bookingId));
        return paymentMapper.toDTO(payment);
    }

    @Transactional
    public PaymentDTO initiatePayment(PaymentDTO paymentDTO) {
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        if (payment.getTransactionId() == null) {
            payment.setTransactionId("WL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        String paymentUrl = "";

        if (payment.getPaymentMethod() == PaymentMethod.MOMO) {
            paymentUrl = initiateMomoPayment(payment);
        } else if (payment.getPaymentMethod() == PaymentMethod.STRIPE) {
            paymentUrl = initiateStripePayment(payment);
        } else {
            // Default simulated payment for other methods
            paymentUrl = "https://simulated-payment-gateway.com/pay?tx=" + payment.getTransactionId();
        }

        payment.setMetadata(Map.of("paymentUrl", paymentUrl));
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    private String initiateMomoPayment(Payment payment) {
        try {
            String requestId = UUID.randomUUID().toString();
            String orderId = payment.getTransactionId();
            String orderInfo = "Payment for booking " + payment.getBookingId();
            String amount = String.valueOf(payment.getAmount().longValue());
            String requestType = "captureWallet";
            String extraData = ""; // Pass email or other info if needed

            // Create Signature
            String rawSignature = "accessKey=" + momoAccessKey +
                    "&amount=" + amount +
                    "&extraData=" + extraData +
                    "&ipnUrl=" + momoIpnUrl +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + momoPartnerCode +
                    "&redirectUrl=" + momoRedirectUrl +
                    "&requestId=" + requestId +
                    "&requestType=" + requestType;

            String signature = hmacSHA256(rawSignature, momoSecretKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", momoPartnerCode);
            requestBody.put("partnerName", "Wanderlust");
            requestBody.put("storeId", "WanderlustStore");
            requestBody.put("requestId", requestId);
            requestBody.put("amount", Long.parseLong(amount));
            requestBody.put("orderId", orderId);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("redirectUrl", momoRedirectUrl);
            requestBody.put("ipnUrl", momoIpnUrl);
            requestBody.put("lang", "vi");
            requestBody.put("requestType", requestType);
            requestBody.put("autoCapture", true);
            requestBody.put("extraData", extraData);
            requestBody.put("signature", signature);

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.postForObject(momoEndpoint, requestBody, Map.class);

            if (response != null && response.containsKey("payUrl")) {
                return (String) response.get("payUrl");
            } else {
                throw new RuntimeException("Failed to initiate MoMo payment: " + response);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error initiating MoMo payment", e);
        }
    }

    private String initiateStripePayment(Payment payment) {
        Stripe.apiKey = stripeSecretKey;

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(momoRedirectUrl + "?success=true&session_id={CHECKOUT_SESSION_ID}") // Reuse redirect URL for now or config separate one
                    .setCancelUrl(momoRedirectUrl + "?canceled=true")
                    .setClientReferenceId(payment.getTransactionId())
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("vnd")
                                    .setUnitAmount(payment.getAmount().longValue()) // Stripe expects amount in smallest currency unit (VND has no decimal, so just amount)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Booking " + payment.getBookingId())
                                            .build())
                                    .build())
                            .build())
                    .build();

            Session session = Session.create(params);
            return session.getUrl();
        } catch (Exception e) {
            throw new RuntimeException("Error initiating Stripe payment", e);
        }
    }

    private String hmacSHA256(String data, String key) throws NoSuchAlgorithmException, InvalidKeyException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return toHexString(rawHmac);
    }

    private String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        return formatter.toString();
    }

    @Transactional
    public PaymentDTO handleGatewayCallback(String gateway, Map<String, Object> callbackData) {
        String internalTxId = null;
        boolean isSuccess = false;
        String gatewayTxId = null;

        if ("momo".equalsIgnoreCase(gateway)) {
            // MoMo Callback Logic
            internalTxId = (String) callbackData.get("orderId");
            int errorCode = (int) callbackData.get("errorCode");
            isSuccess = (errorCode == 0);
            gatewayTxId = String.valueOf(callbackData.get("transId"));
            
            // Verify signature here if needed for security
            
        } else if ("stripe".equalsIgnoreCase(gateway)) {
            // Stripe Webhook Logic (Simplified for now, ideally verify signature from header)
            // In a real scenario, we parse the event from the body
            // For this simple implementation, we might assume the callbackData is the event object or simplified data
            // But Stripe webhooks are usually POSTed as raw body. 
            // For now, let's assume we handle Stripe via client-side redirect success or a separate webhook endpoint.
            // If this is a redirect return:
            internalTxId = (String) callbackData.get("clientReferenceId"); // If passed
            // This part depends on how we structure the callback. 
            // For Stripe Checkout, we usually rely on the Webhook, not the redirect return for fulfillment.
            // Let's assume this method is called by a Webhook Controller that parses the Stripe Event.
        }

        if (internalTxId == null) {
             // Fallback or error
             return null;
        }

        final String finalInternalTxId = internalTxId;
        Payment payment = paymentRepository.findByTransactionId(finalInternalTxId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for transaction " + finalInternalTxId));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
             return paymentMapper.toDTO(payment);
        }

        if (isSuccess) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            payment.setGatewayTransactionId(gatewayTxId);
            
            try {
                bookingService.confirmBooking(payment.getBookingId());
            } catch (Exception e) {
                System.err.println("Failed to confirm booking: " + payment.getBookingId() + " after payment success.");
            }

        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailedAt(LocalDateTime.now());
            payment.setErrorMessage("Payment failed via " + gateway);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    @Transactional
    public PaymentDTO refundPayment(String id, RefundRequestDTO refundRequest) { 
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot refund a non-completed payment");
        }
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new IllegalStateException("Payment already refunded");
        }

        boolean gatewayRefundSuccess = true; 
        // Implement Gateway Refund Logic here if needed (MoMo/Stripe refund API)

        if (gatewayRefundSuccess) {
            BigDecimal refundAmount = refundRequest.getAmount() != null ? refundRequest.getAmount() : payment.getAmount();

            WalletRefundRequestDTO walletRefundReq = new WalletRefundRequestDTO();
            walletRefundReq.setOrderId(payment.getBookingId());
            walletRefundReq.setReason(refundRequest.getReason());
            walletRefundReq.setAmount(refundAmount);
            
            walletService.processRefund(payment.getUserId(), walletRefundReq);
            
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setRefundReason(refundRequest.getReason());
            payment.setRefundAmount(refundAmount);
            payment.setRefundedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);
            return paymentMapper.toDTO(savedPayment);
        } else {
            throw new RuntimeException("Gateway refund failed");
        }
    }

    @Transactional
    public PaymentDTO verifyPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            return paymentMapper.toDTO(payment);
        }

        // Check status with Gateway (MoMo/Stripe Query API)
        boolean isActuallyPaid = false; 
        // Implement Query API here

        if (isActuallyPaid) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            
            try {
                bookingService.confirmBooking(payment.getBookingId());
            } catch (Exception e) {
                System.err.println("Failed to confirm booking: " + payment.getBookingId() + " after payment verification.");
            }
        } else {
            // Maybe it's still pending or failed
        }
        
        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    @Transactional
    public PaymentDTO update(String id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
        paymentMapper.updateEntityFromDTO(paymentDTO, existingPayment);
        existingPayment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(existingPayment);
        return paymentMapper.toDTO(savedPayment);
    }
    @Transactional
    public void delete(String id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payment not found with id " + id);
        }
        paymentRepository.deleteById(id);
    }
    @Transactional
    public void deleteAll() {
        paymentRepository.deleteAll();
    }
}
