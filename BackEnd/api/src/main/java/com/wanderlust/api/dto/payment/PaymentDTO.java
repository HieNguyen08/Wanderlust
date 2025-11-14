package com.wanderlust.api.dto.payment;

import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private String id;
    private String bookingId;
    private String userId;

    // Amount
    private BigDecimal amount;
    private String currency;

    // Method
    private PaymentMethod paymentMethod;
    private String paymentGateway;
    private String cardLast4;
    private String cardBrand;

    // Transaction
    private String transactionId;
    private String gatewayTransactionId;

    // Status
    private PaymentStatus status;

    // Timestamps
    private LocalDateTime paidAt;
    private LocalDateTime failedAt;
    private LocalDateTime refundedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Error
    private String errorCode;
    private String errorMessage;

    // Refund
    private BigDecimal refundAmount;
    private String refundReason;

    // Metadata
    private Map<String, Object> metadata;
}