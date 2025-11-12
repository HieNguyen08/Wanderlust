package com.wanderlust.api.dto.admin;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AdminRefundRequestDTO {
    private String userId;
    private BigDecimal amount;
    private String reason; // Lý do (VD: Bồi thường, sự cố...)
    private String orderId; // (Optional) Đơn hàng liên quan
}