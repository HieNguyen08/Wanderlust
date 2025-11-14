package com.wanderlust.api.services;

import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.dto.payment.RefundRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletRefundRequestDTO;

import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.mapper.PaymentMapper;
import com.wanderlust.api.repository.PaymentRepository;

// === IMPORT MỚI ===
import com.wanderlust.api.services.BookingService; 

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final WalletService walletService; 
    
    // === TIÊM BOOKING SERVICE ===
    private final BookingService bookingService; 
    
    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt");

    // ... (Các hàm findAll, findById, findByUserId, findByBookingId giữ nguyên) ...
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

    // ... (Hàm initiatePayment giữ nguyên) ...
    @Transactional
    public PaymentDTO initiatePayment(PaymentDTO paymentDTO) {
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        if (payment.getTransactionId() == null) {
            payment.setTransactionId("WL-PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        String fakePaymentUrl = "https://simulated-payment-gateway.com/pay?tx=" + payment.getTransactionId();
        payment.setMetadata(Map.of("paymentUrl", fakePaymentUrl));
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }


    // --- ACTION: Xử lý callback (CẬP NHẬT) ---
    @Transactional
    public PaymentDTO handleGatewayCallback(String gateway, Map<String, Object> callbackData) {
        String internalTxId = (String) callbackData.get("transactionId"); 
        Payment payment = paymentRepository.findByTransactionId(internalTxId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for transaction " + internalTxId));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
             return paymentMapper.toDTO(payment);
        }

        boolean isSuccess = (boolean) callbackData.get("isSuccess"); 
        
        if (isSuccess) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            payment.setGatewayTransactionId((String) callbackData.get("gatewayTransactionId"));
            
            // === TÍCH HỢP: GỌI BOOKING SERVICE ===
            // Tự động xác nhận đơn hàng khi thanh toán thành công
            try {
                bookingService.confirmBooking(payment.getBookingId());
            } catch (Exception e) {
                // Log lỗi nếu confirm booking thất bại, nhưng vẫn lưu payment
                // (Cân nhắc dùng @Async hoặc event-based)
                System.err.println("Failed to confirm booking: " + payment.getBookingId() + " after payment success.");
            }
            // ===================================

        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailedAt(LocalDateTime.now());
            payment.setErrorMessage((String) callbackData.get("errorMessage"));
        }

        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    // --- ACTION: Xử lý Refund (Giữ nguyên) ---
    // Logic này đã đúng: gọi WalletService [cite: 20]
    @Transactional
    public PaymentDTO refundPayment(String id, RefundRequestDTO refundRequest) { // 
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot refund a non-completed payment");
        }
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new IllegalStateException("Payment already refunded");
        }

        boolean gatewayRefundSuccess = true; 

        if (gatewayRefundSuccess) {
            BigDecimal refundAmount = refundRequest.getAmount() != null ? refundRequest.getAmount() : payment.getAmount();

            // 1. Tạo DTO (của wallet) 
            WalletRefundRequestDTO walletRefundReq = new WalletRefundRequestDTO();
            walletRefundReq.setOrderId(payment.getBookingId());
            walletRefundReq.setReason(refundRequest.getReason());
            walletRefundReq.setAmount(refundAmount);
            
            // 2. Gọi service ví để cộng tiền [cite: 20]
            walletService.processRefund(payment.getUserId(), walletRefundReq);
            
            // 3. Cập nhật trạng thái Payment gốc
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

    // --- ACTION: Xác thực thanh toán (CẬP NHẬT) ---
    @Transactional
    public PaymentDTO verifyPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            return paymentMapper.toDTO(payment);
        }

        boolean isActuallyPaid = true; // Giả định là đã thanh toán

        if (isActuallyPaid) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            
            // === TÍCH HỢP: GỌI BOOKING SERVICE ===
            try {
                bookingService.confirmBooking(payment.getBookingId());
            } catch (Exception e) {
                System.err.println("Failed to confirm booking: " + payment.getBookingId() + " after payment verification.");
            }
            // ===================================
            
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailedAt(LocalDateTime.now());
        }
        
        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }


    // ... (Các hàm update, delete, deleteAll của Admin giữ nguyên) ...
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