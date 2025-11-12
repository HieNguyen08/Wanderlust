package com.wanderlust.api.dto.admin;

import lombok.Data;

@Data
public class AdminRejectRefundDTO {
    private String reason; // Lý do từ chối
}