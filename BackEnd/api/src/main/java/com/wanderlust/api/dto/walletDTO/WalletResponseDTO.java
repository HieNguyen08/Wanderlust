package com.wanderlust.api.dto.walletDTO;

import lombok.Data;
import java.math.BigDecimal;
import com.wanderlust.api.entity.types.WalletStatus;

@Data
public class WalletResponseDTO {
    private String walletId;
    private BigDecimal balance;
    private String currency;
    private BigDecimal totalTopUp;
    private BigDecimal totalSpent;
    private BigDecimal totalRefund;
    private WalletStatus status;
}