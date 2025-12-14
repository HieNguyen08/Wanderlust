
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
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.dto.payment.RefundRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletRefundRequestDTO;
import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.mapper.PaymentMapper;
import com.wanderlust.api.repository.PaymentRepository;
import com.wanderlust.api.repository.UserRepository;
import com.wanderlust.api.repository.WalletRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final WalletService walletService;
    private final BookingService bookingService;
    private final WalletRepository walletRepository;
    private final TransactionService transactionService;
    private final MoneyTransferService moneyTransferService;
    private final UserRepository userRepository;

    // Constructor với @Lazy để tránh circular dependency
    public PaymentService(
            PaymentRepository paymentRepository,
            PaymentMapper paymentMapper,
            @Lazy WalletService walletService,
            BookingService bookingService,
            WalletRepository walletRepository,
            TransactionService transactionService,
            MoneyTransferService moneyTransferService,
            UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.walletService = walletService;
        this.bookingService = bookingService;
        this.walletRepository = walletRepository;
        this.transactionService = transactionService;
        this.moneyTransferService = moneyTransferService;
        this.userRepository = userRepository;
    }

    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt");

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable-key}")
    private String stripePublishableKey;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    @Value("${stripe.success-url.wallet:${stripe.success-url}}")
    private String stripeWalletSuccessUrl;

    @Value("${stripe.cancel-url.wallet:${stripe.cancel-url}}")
    private String stripeWalletCancelUrl;

    @Value("${stripe.success-url.booking:${stripe.success-url}}")
    private String stripeBookingSuccessUrl;

    @Value("${stripe.cancel-url.booking:${stripe.cancel-url}}")
    private String stripeBookingCancelUrl;

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
        // Resolve userId from email when missing (token only holds email)
        if ((paymentDTO.getUserId() == null || paymentDTO.getUserId().isBlank())
                && paymentDTO.getUserEmail() != null) {
            userRepository.findByEmail(paymentDTO.getUserEmail())
                    .ifPresent(user -> paymentDTO.setUserId(user.getUserId()));
        }

        if (paymentDTO.getUserId() == null || paymentDTO.getUserId().isBlank()) {
            throw new ResourceNotFoundException("User not found for payment");
        }

        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        // Nhận diện luồng nạp ví (bookingId định dạng TOPUP-{transactionId})
        boolean isTopUp = payment.getBookingId() != null && payment.getBookingId().startsWith("TOPUP-");

        if (payment.getTransactionId() == null) {
            payment.setTransactionId("WL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        String paymentUrl = "";

        if (payment.getPaymentMethod() == PaymentMethod.WALLET) {
            // Thanh toán bằng ví - xử lý ngay lập tức
            processWalletPayment(payment);
            // Không có paymentUrl vì thanh toán trực tiếp
            payment.setMetadata(Map.of("message", "Payment processed via wallet"));
        } else if (payment.getPaymentMethod() == PaymentMethod.STRIPE) {
            // Thanh toán bằng Stripe - tạo session và trả về URL
            paymentUrl = initiateStripePayment(payment);
            // Giữ metadata từ initiateStripePayment (stripe_session_id, payment_type) và bổ sung paymentUrl
            Map<String, Object> metadata = payment.getMetadata() != null
                    ? new HashMap<>(payment.getMetadata())
                    : new HashMap<>();
            metadata.put("paymentUrl", paymentUrl);
            payment.setMetadata(metadata);
            payment.setStatus(PaymentStatus.PROCESSING);
            // Đánh dấu booking đang được xử lý thanh toán (không áp dụng cho top-up ví)
            if (!isTopUp && payment.getBookingId() != null) {
                bookingService.updatePaymentStatus(payment.getBookingId(), PaymentStatus.PROCESSING, payment.getPaymentMethod());
            }
        } else {
            // Default simulated payment for other methods
            paymentUrl = "https://simulated-payment-gateway.com/pay?tx=" + payment.getTransactionId();
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("paymentUrl", paymentUrl);
            payment.setMetadata(metadata);
            payment.setStatus(PaymentStatus.PROCESSING);
            if (payment.getBookingId() != null) {
                bookingService.updatePaymentStatus(payment.getBookingId(), PaymentStatus.PROCESSING, payment.getPaymentMethod());
            }
        }

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    /**
     * Xử lý thanh toán bằng ví
     */
    private void processWalletPayment(Payment payment) {
        String userId = payment.getUserId();
        String bookingId = payment.getBookingId();
        BigDecimal amount = payment.getAmount();
        
        try {
            // Kiểm tra số dư
            if (!walletService.hasSufficientBalance(userId, amount)) {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setErrorMessage("Insufficient balance in wallet");
                payment.setFailedAt(LocalDateTime.now());
                throw new RuntimeException("Insufficient balance in wallet");
            }

            // Chuyển tiền từ user -> admin
            moneyTransferService.processBookingPayment(bookingId, userId, "WALLET");

            // Cập nhật trạng thái payment
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());

            // Chỉ cập nhật paymentStatus, booking status VẪN LÀ PENDING
            // (chờ vendor/admin confirm sau khi thanh toán thành công)
            if (bookingId != null) {
                bookingService.updatePaymentStatus(bookingId, PaymentStatus.COMPLETED, PaymentMethod.WALLET);
            }

            log.info("✅ Wallet payment completed for booking {}", bookingId);
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setErrorMessage(e.getMessage());
            payment.setFailedAt(LocalDateTime.now());
            if (bookingId != null) {
                bookingService.updatePaymentStatus(bookingId, PaymentStatus.FAILED, PaymentMethod.WALLET);
            }
            log.error("❌ Wallet payment failed: {}", e.getMessage());
            throw new RuntimeException("Wallet payment failed: " + e.getMessage());
        }
    }

    private String initiateStripePayment(Payment payment) {
        Stripe.apiKey = stripeSecretKey;

        try {
            String currency = payment.getCurrency() != null ? payment.getCurrency().toLowerCase() : "vnd";
            long amountInCents = payment.getAmount().longValue();

            // Xác định loại giao dịch: BOOKING hay WALLET_TOPUP
            boolean isTopUp = payment.getBookingId() != null && payment.getBookingId().startsWith("TOPUP-");
            String productName = isTopUp ? "Nạp tiền ví Wanderlust" : "Thanh toán Booking #" + payment.getBookingId();
            String description = isTopUp ? "Nạp tiền vào ví cá nhân" : "Thanh toán dịch vụ du lịch";
            String paymentType = isTopUp ? "WALLET_TOPUP" : "BOOKING";

                String successUrl = isTopUp ? stripeWalletSuccessUrl : stripeBookingSuccessUrl;
                String cancelUrl = isTopUp ? stripeWalletCancelUrl : stripeBookingCancelUrl;

                SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .setClientReferenceId(payment.getTransactionId())
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency(currency)
                                    .setUnitAmount(amountInCents)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName(productName)
                                            .setDescription(description)
                                            .build())
                                    .build())
                            .build());

            // Thêm metadata quan trọng để xử lý callback
            paramsBuilder.putMetadata("payment_type", paymentType); 
            paramsBuilder.putMetadata("booking_id", payment.getBookingId());
            paramsBuilder.putMetadata("user_id", payment.getUserId());
            paramsBuilder.putMetadata("transaction_id", payment.getTransactionId());

            Session session = Session.create(paramsBuilder.build());

            Map<String, Object> metadata = payment.getMetadata() != null ? payment.getMetadata() : new HashMap<>();
            metadata.put("stripe_session_id", session.getId());
            payment.setMetadata(metadata);

            return session.getUrl();
        } catch (Exception e) {
            throw new RuntimeException("Error initiating Stripe payment: " + e.getMessage(), e);
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
        String paymentType = "BOOKING"; // Mặc định

        if ("stripe".equalsIgnoreCase(gateway)) {
            // Stripe Webhook Event Handling
            String eventType = (String) callbackData.get("type");

            if ("checkout.session.completed".equals(eventType)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> sessionData = (Map<String, Object>) callbackData.get("data");
                @SuppressWarnings("unchecked")
                Map<String, Object> object = (Map<String, Object>) sessionData.get("object");
                @SuppressWarnings("unchecked")
                Map<String, String> metadata = (Map<String, String>) object.get("metadata");

                internalTxId = (String) object.get("client_reference_id");
                String stripeSessionId = (String) object.get("id");
                String paymentStatus = (String) object.get("payment_status");
                
                // Lấy loại thanh toán từ metadata
                if (metadata != null && metadata.containsKey("payment_type")) {
                    paymentType = metadata.get("payment_type");
                }

                isSuccess = "paid".equals(paymentStatus);
                gatewayTxId = stripeSessionId;

            } else if ("payment_intent.succeeded".equals(eventType)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> intentData = (Map<String, Object>) callbackData.get("data");
                @SuppressWarnings("unchecked")
                Map<String, Object> object = (Map<String, Object>) intentData.get("object");

                gatewayTxId = (String) object.get("id");

                // Try to find payment by gateway transaction ID
                Payment foundPayment = paymentRepository.findByGatewayTransactionId(gatewayTxId)
                        .orElse(null);

                if (foundPayment != null) {
                    internalTxId = foundPayment.getTransactionId();
                    isSuccess = true;
                }

            } else if ("payment_intent.payment_failed".equals(eventType)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> intentData = (Map<String, Object>) callbackData.get("data");
                @SuppressWarnings("unchecked")
                Map<String, Object> object = (Map<String, Object>) intentData.get("object");

                gatewayTxId = (String) object.get("id");
                isSuccess = false;

                Payment foundPayment = paymentRepository.findByGatewayTransactionId(gatewayTxId)
                        .orElse(null);

                if (foundPayment != null) {
                    internalTxId = foundPayment.getTransactionId();
                }
            }
        }

        if (internalTxId == null) {
            // Fallback or error
            return null;
        }

        final String finalInternalTxId = internalTxId;
        Payment payment = paymentRepository.findByTransactionId(finalInternalTxId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Payment not found for transaction " + finalInternalTxId));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            return paymentMapper.toDTO(payment);
        }

        if (isSuccess) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            payment.setGatewayTransactionId(gatewayTxId);

            // === PHÂN LUỒNG XỬ LÝ SAU KHI THANH TOÁN THÀNH CÔNG ===
            if ("WALLET_TOPUP".equals(paymentType)) {
                // 1. Logic Nạp tiền: Cộng tiền vào ví
                try {
                    Wallet wallet = walletRepository.findByUserId(payment.getUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
                    
                    // Gọi updateBalance của WalletService
                    walletService.updateBalance(wallet.getWalletId(), payment.getAmount(), TransactionType.CREDIT);
                    
                    // CẬP NHẬT TRANSACTION STATUS: PENDING -> COMPLETED
                    // Extract transaction ID từ bookingId (format: "TOPUP-{transactionId}")
                    String bookingId = payment.getBookingId();
                    if (bookingId != null && bookingId.startsWith("TOPUP-")) {
                        String transactionId = bookingId.substring(6); // Bỏ prefix "TOPUP-"
                        transactionService.updateTransactionStatus(
                            transactionId, 
                            TransactionStatus.COMPLETED, 
                            gatewayTxId
                        );
                        System.out.println("✅ Transaction updated to COMPLETED: " + transactionId);
                    }
                    
                    System.out.println("✅ Wallet topped up successfully for User: " + payment.getUserId());
                } catch (Exception e) {
                    System.err.println("❌ Failed to update wallet balance: " + e.getMessage());
                }
            } else {
                // 2. Logic Booking: chuyển tiền về admin và cập nhật payment status
                try {
                    moneyTransferService.processBookingPayment(payment.getBookingId(), payment.getUserId(), payment.getPaymentMethod().name());
                    // Chỉ cập nhật paymentStatus, KHÔNG gọi confirmBooking để update status
                    bookingService.updatePaymentStatus(payment.getBookingId(), PaymentStatus.COMPLETED, payment.getPaymentMethod());
                    System.out.println("✅ Booking payment status updated: " + payment.getBookingId());
                } catch (Exception e) {
                    System.err.println("❌ Failed to update booking payment status: " + payment.getBookingId());
                }
            }

        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailedAt(LocalDateTime.now());
            payment.setErrorMessage("Payment failed via " + gateway);

            if (payment.getBookingId() != null) {
                bookingService.updatePaymentStatus(payment.getBookingId(), PaymentStatus.FAILED, payment.getPaymentMethod());
            }
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
            BigDecimal refundAmount = refundRequest.getAmount() != null ? refundRequest.getAmount()
                    : payment.getAmount();

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
                System.err.println(
                        "Failed to confirm booking: " + payment.getBookingId() + " after payment verification.");
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

    /**
     * Xác nhận thanh toán Stripe thành công từ frontend (sau khi redirect)
     * Dùng trong trường hợp webhook chưa kịp cập nhật hoặc test mode không có webhook
     */
    @Transactional
    public PaymentDTO confirmStripePaymentSuccess(String bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking " + bookingId));

        // Nếu đã COMPLETED rồi (webhook đã xử lý), không làm gì cả
        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.info("✅ Payment already COMPLETED for booking {}", bookingId);
            return paymentMapper.toDTO(payment);
        }

        // Nếu đang PROCESSING, cập nhật thành COMPLETED
        if (payment.getStatus() == PaymentStatus.PROCESSING) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());

            // Cập nhật payment status của booking (giữ nguyên status = PENDING)
            bookingService.updatePaymentStatus(bookingId, PaymentStatus.COMPLETED, payment.getPaymentMethod());

            // Chuyển tiền về admin nếu chưa chuyển
            try {
                moneyTransferService.processBookingPayment(bookingId, payment.getUserId(), payment.getPaymentMethod().name());
                log.info("✅ Payment confirmed and money transferred for booking {}", bookingId);
            } catch (Exception e) {
                log.warn("⚠️ Money transfer may have already been processed: {}", e.getMessage());
            }

            Payment savedPayment = paymentRepository.save(payment);
            return paymentMapper.toDTO(savedPayment);
        }

        // Nếu trạng thái khác PROCESSING, không cho phép xác nhận
        throw new RuntimeException("Cannot confirm payment in status " + payment.getStatus());
    }
}
