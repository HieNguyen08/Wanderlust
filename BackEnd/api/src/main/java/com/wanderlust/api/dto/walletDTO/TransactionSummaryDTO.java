package com.wanderlust.api.dto.walletDTO;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@Builder
public class TransactionSummaryDTO {
    private BigDecimal totalCredit; // Tổng nạp
    private BigDecimal totalDebit;  // Tổng chi
    private BigDecimal totalRefund; // Tổng hoàn tiền
}