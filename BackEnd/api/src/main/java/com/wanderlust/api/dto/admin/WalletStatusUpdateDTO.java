package com.wanderlust.api.dto.admin;

import com.wanderlust.api.entity.types.WalletStatus;
import lombok.Data;

@Data
public class WalletStatusUpdateDTO {
    private WalletStatus newStatus; // ACTIVE, SUSPENDED
    private String reason;
}