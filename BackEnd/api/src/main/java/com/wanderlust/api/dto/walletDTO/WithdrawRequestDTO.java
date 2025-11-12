package com.wanderlust.api.dto.walletDTO;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WithdrawRequestDTO {
    private BigDecimal amount;
    private String bankAccountNumber;
    private String bankCode;
    private String accountName;
}