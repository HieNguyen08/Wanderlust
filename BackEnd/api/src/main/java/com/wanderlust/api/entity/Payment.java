package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    private String id; // Sửa paymentId -> id

    private String bookingId; // Sửa booking_ID -> bookingId
    private String userId;
    private String userEmail; // Optional: for lookups when only email is known

    // --- Amount Details ---
    private BigDecimal amount; // Sửa payment_Amount (Float) -> amount (BigDecimal)
    private String currency;   // VD: "VND", "USD"

    // --- Payment Method & Gateway ---
    private PaymentMethod paymentMethod; // Enum: MOMO, ZALOPAY, CREDIT_CARD...
    
    private String paymentGateway; // VD: "stripe", "vnpay"

    // --- Card Info (Sensitive Data - Tokenized) ---
    private String cardLast4; // 4 số cuối thẻ
    private String cardBrand; // VD: "Visa"

    // --- Transaction Info ---
    @Indexed(unique = true) // Đảm bảo mã giao dịch là duy nhất
    private String transactionId; // Mã giao dịch nội bộ hệ thống
    
    private String gatewayTransactionId; // Mã giao dịch từ phía Gateway (Paypal/VNPAY trả về)

    // --- Status ---
    private PaymentStatus status; // Enum (thay cho String Status)

    // --- Timestamps ---
    private LocalDateTime paidAt;
    private LocalDateTime failedAt;
    private LocalDateTime refundedAt;

    // --- Error Handling ---
    private String errorCode;
    private String errorMessage;

    // --- Refund Details ---
    private BigDecimal refundAmount;
    private String refundReason;

    // --- Metadata ---
    // Lưu dữ liệu JSON đặc thù của từng cổng thanh toán
    private Map<String, Object> metadata;

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}