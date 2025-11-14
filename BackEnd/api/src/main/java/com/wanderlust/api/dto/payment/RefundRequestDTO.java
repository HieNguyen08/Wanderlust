package com.wanderlust.api.dto.payment;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class RefundRequestDTO {
    private String reason;
    private BigDecimal amount; // Optional: Admin có thể chỉ định số tiền refund
}