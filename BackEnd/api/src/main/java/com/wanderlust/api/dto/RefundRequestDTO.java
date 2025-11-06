package com.wanderlust.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RefundRequestDTO {
    private String orderId;       // Đơn hàng gốc cần hoàn tiền
    private BigDecimal amount;        // Số tiền hoàn
    private String reason;        // Lý do hoàn tiền
}