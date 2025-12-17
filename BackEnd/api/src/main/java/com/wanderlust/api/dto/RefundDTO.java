package com.wanderlust.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.wanderlust.api.entity.types.RefundStatus;

import lombok.Data;

@Data
public class RefundDTO {
    private String id;
    private String bookingId;
    private String bookingCode;

    private String userId;
    private String userName;
    private String userEmail;

    // Service Info
    private String serviceName;
    private String serviceType;
    private String vendorName;

    private String paymentMethod; // Added field

    private String reason; // Refund reason
    private BigDecimal amount; // Refund amount
    private RefundStatus status;

    private String adminResponse;
    private String processedBy;
    private LocalDateTime processedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Original booking info for context
    private BigDecimal originalAmount;
}
