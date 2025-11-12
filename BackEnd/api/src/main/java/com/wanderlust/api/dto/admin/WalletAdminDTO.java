package com.wanderlust.api.dto.admin;

import com.wanderlust.api.entity.types.WalletStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class WalletAdminDTO {
    private String walletId;
    private String userId;
    private String userEmail; // Cần join/lấy từ UserRepository
    private String userName;  // Cần join/lấy từ UserRepository
    private BigDecimal balance;
    private WalletStatus status;
}