package com.wanderlust.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WalletPaymentRequestDTO {
    private String orderId;        // Mã đơn hàng cần thanh toán
    private BigDecimal amount;         // Số tiền thanh toán
    private String description;    // Mô tả
}