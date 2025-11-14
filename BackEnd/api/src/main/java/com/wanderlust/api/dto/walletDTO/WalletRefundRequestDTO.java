package com.wanderlust.api.dto.walletDTO;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class WalletRefundRequestDTO {
    private String orderId;       // Đơn hàng gốc cần hoàn tiền
    private BigDecimal amount;        // Số tiền hoàn
    private String reason;        // Lý do hoàn tiền
}