package com.wanderlust.api.services;

import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.dto.payment.RefundRequestDTO;
import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.mapper.PaymentMapper;
import com.wanderlust.api.repository.PaymentRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt");

    // --- GET: Lấy tất cả (Admin) ---
    public List<PaymentDTO> findAll() {
        return paymentMapper.toDTOs(paymentRepository.findAll(defaultSort));
    }

    // --- GET: Chi tiết 1 payment ---
    public PaymentDTO findById(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
        return paymentMapper.toDTO(payment);
    }
    
    // --- GET: Lấy theo User ID ---
    public List<PaymentDTO> findByUserId(String userId) {
        // Cần thêm phương thức này vào PaymentRepository
        // List<Payment> payments = paymentRepository.findByUserId(userId, defaultSort);
        // Tạm thời filter:
        List<Payment> payments = paymentRepository.findAll(defaultSort)
                .stream().filter(p -> p.getUserId().equals(userId)).toList();
        return paymentMapper.toDTOs(payments);
    }
    
    // --- GET: Lấy theo Booking ID ---
    public PaymentDTO findByBookingId(String bookingId) {
        // Cần thêm phương thức này vào PaymentRepository
        // Payment payment = paymentRepository.findByBookingId(bookingId)
        //         .orElseThrow(() -> new RuntimeException("Payment not found for booking id " + bookingId));
        // Tạm thời filter:
         Payment payment = paymentRepository.findAll()
                .stream().filter(p -> p.getBookingId().equals(bookingId)).findFirst()
                 .orElseThrow(() -> new RuntimeException("Payment not found for booking id " + bookingId));
        return paymentMapper.toDTO(payment);
    }


    // --- ACTION: Khởi tạo thanh toán (API 31) ---
    public PaymentDTO initiatePayment(PaymentDTO paymentDTO) {
        Payment payment = paymentMapper.toEntity(paymentDTO);
        
        // Set defaults khi khởi tạo
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        // Tạo mã giao dịch nội bộ
        if (payment.getTransactionId() == null) {
            payment.setTransactionId("WL-PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // TODO: Gọi đến cổng thanh toán (Stripe, MoMo...) và nhận URL thanh toán
        // payment.setMetadata(Map.of("paymentUrl", "http://..."));

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    // --- ACTION: Xử lý callback từ Gateway (API 31) ---
    public PaymentDTO handleGatewayCallback(String gateway, Map<String, Object> callbackData) {
        // TODO: Logic xác thực callback
        
        // Giả sử callbackData chứa gatewayTransactionId
        String gatewayTxId = (String) callbackData.get("gatewayTransactionId");
        
        Payment payment = paymentRepository.findAll().stream() // Cần tạo index/method tìm theo gatewayTransactionId
                .filter(p -> gatewayTxId.equals(p.getGatewayTransactionId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Payment not found for gateway transaction " + gatewayTxId));

        // TODO: Kiểm tra trạng thái từ callback
        boolean isSuccess = (boolean) callbackData.get("isSuccess"); 
        
        if (isSuccess) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailedAt(LocalDateTime.now());
            payment.setErrorMessage((String) callbackData.get("errorMessage"));
        }
        
        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    // --- ACTION: Xử lý Refund (API 31, 39) ---
    public PaymentDTO refundPayment(String id, RefundRequestDTO refundRequest) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Cannot refund a non-completed payment");
        }

        // TODO: Gọi API refund của cổng thanh toán

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundReason(refundRequest.getReason());
        payment.setRefundAmount(refundRequest.getAmount() != null ? refundRequest.getAmount() : payment.getAmount()); // Refund toàn bộ nếu ko chỉ định
        payment.setRefundedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    // --- ACTION: Xác thực thanh toán (API 31) ---
    public PaymentDTO verifyPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            return paymentMapper.toDTO(payment);
        }

        // TODO: Gọi API của gateway để kiểm tra lại trạng thái
        // boolean isActuallyPaid = paymentGatewayService.checkStatus(payment.getTransactionId());
        boolean isActuallyPaid = true; // Giả định là đã thanh toán

        if (isActuallyPaid) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
        } else {
             payment.setStatus(PaymentStatus.FAILED);
             payment.setFailedAt(LocalDateTime.now());
        }
        
        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }


    // --- PUT: Update (Admin) ---
    public PaymentDTO update(String id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));

        // Dùng mapper để update các trường có trong DTO
        paymentMapper.updateEntityFromDTO(paymentDTO, existingPayment);
        existingPayment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(existingPayment);
        return paymentMapper.toDTO(savedPayment);
    }

    // --- DELETE: Xóa (Admin) ---
    public void delete(String id) {
        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found with id " + id);
        }
        paymentRepository.deleteById(id);
    }

    // --- DELETE: Xóa tất cả (Admin) ---
    public void deleteAll() {
        paymentRepository.deleteAll();
    }
}