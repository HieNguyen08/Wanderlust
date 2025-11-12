package com.wanderlust.api.dto.admin;


import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;
import com.wanderlust.api.entity.types.WalletStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class WalletDetailAdminDTO {
    // User Info
    private String userId;
    private String userEmail;
    private String userFullName;
    private String userPhone;

    // Wallet Info
    private String walletId;
    private BigDecimal balance;
    private String currency;
    private WalletStatus status;
    
    // Summary
    private TransactionSummaryDTO summary; // Gồm totalTopUp, totalSpent, totalRefund
}