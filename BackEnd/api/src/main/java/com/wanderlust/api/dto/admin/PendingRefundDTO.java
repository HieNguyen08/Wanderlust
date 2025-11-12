package com.wanderlust.api.dto.admin;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PendingRefundDTO {
    private String transactionId;
    private String userId;
    private String userEmail; // Cần lấy thông tin user
    private BigDecimal amount;
    private String orderId;
    private String reason;
    private LocalDateTime requestedAt; // Chính là createdAt của transaction
}