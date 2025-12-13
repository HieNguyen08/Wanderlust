package com.wanderlust.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.dto.payment.RefundRequestDTO;
import com.wanderlust.api.services.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // --- Admin Endpoints ---
    /**
     * [ADMIN] Lấy tất cả payments
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> allPayments = paymentService.findAll();
        return new ResponseEntity<>(allPayments, HttpStatus.OK);
    }

    /**
     * [ADMIN] Cập nhật payment (dùng cho admin)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePayment(@PathVariable String id, @RequestBody PaymentDTO paymentDTO) {
        try {
            PaymentDTO updatedPayment = paymentService.update(id, paymentDTO);
            return new ResponseEntity<>(updatedPayment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * [ADMIN] Xóa 1 payment
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePayment(@PathVariable String id) {
        try {
            paymentService.delete(id);
            return new ResponseEntity<>("Payment has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * [ADMIN] Xóa tất cả payments
     */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllPayments() {
        paymentService.deleteAll();
        return new ResponseEntity<>("All payments have been deleted successfully!", HttpStatus.OK);
    }

    // --- Action Endpoints (API 31, 39) ---

    /**
     * [USER/ADMIN] Khởi tạo một thanh toán mới
     */
    @PostMapping("/initiate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDTO> initiatePayment(@RequestBody PaymentDTO paymentDTO, Authentication authentication) {
        PaymentDTO newPayment = paymentService.initiatePayment(paymentDTO);
        return new ResponseEntity<>(newPayment, HttpStatus.CREATED);
    }

    /**
     * [USER/ADMIN] Xử lý Refund (API 31, 39)
     */
    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isPaymentOwner(authentication, #id)") // <-- SỬA
    public ResponseEntity<?> refundPayment(@PathVariable String id, @RequestBody RefundRequestDTO refundRequest) {
        try {
            PaymentDTO refundedPayment = paymentService.refundPayment(id, refundRequest);
            return new ResponseEntity<>(refundedPayment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * [USER/ADMIN] Xác thực lại thanh toán
     */
    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isPaymentOwner(authentication, #id)") // <-- SỬA
    public ResponseEntity<?> verifyPayment(@PathVariable String id) {
        try {
            PaymentDTO verifiedPayment = paymentService.verifyPayment(id);
            return new ResponseEntity<>(verifiedPayment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * [PUBLIC] Callback từ cổng thanh toán
     */
    @PostMapping("/callback/{gateway}")
    public ResponseEntity<PaymentDTO> handleGatewayCallback(@PathVariable String gateway, @RequestBody Map<String, Object> callbackData) {
        try {
            PaymentDTO payment = paymentService.handleGatewayCallback(gateway, callbackData);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (Exception e) {
            // Callback nên luôn trả 200 OK để gateway không retry, 
            // nhưng log lỗi nghiêm trọng
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    // --- GET Endpoints (Authenticated) ---

    /**
     * [USER/ADMIN] Lấy chi tiết 1 payment
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isPaymentOwner(authentication, #id)") // <-- SỬA
    public ResponseEntity<?> getPaymentById(@PathVariable String id) {
        try {
            PaymentDTO payment = paymentService.findById(id);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * [USER/ADMIN] Xác nhận thanh toán Stripe thành công (được gọi từ frontend sau redirect)
     * API này xử lý trường hợp webhook chưa kịp cập nhật hoặc test mode không có webhook
     */
    @PostMapping("/confirm-stripe-success/{bookingId}")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isBookingOwner(authentication, #bookingId)")
    public ResponseEntity<?> confirmStripeSuccess(@PathVariable String bookingId) {
        try {
            PaymentDTO payment = paymentService.confirmStripePaymentSuccess(bookingId);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * [USER/ADMIN] Lấy payment theo Booking ID
     */
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isBookingOwner(authentication, #bookingId)") // <-- SỬA
    public ResponseEntity<?> getPaymentByBookingId(@PathVariable String bookingId) {
        try {
            PaymentDTO payment = paymentService.findByBookingId(bookingId);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

     /**
     * [USER/ADMIN] Lấy tất cả payment của 1 User
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isCurrentUser(authentication, #userId)") // <-- SỬA
    public ResponseEntity<?> getPaymentsByUserId(@PathVariable String userId) {
        try {
            List<PaymentDTO> payments = paymentService.findByUserId(userId);
            return new ResponseEntity<>(payments, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}