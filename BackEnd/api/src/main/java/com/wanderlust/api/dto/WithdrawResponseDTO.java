package com.wanderlust.api.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class WithdrawResponseDTO {
    private String withdrawId;
    private String status; // PENDING, PROCESSING, COMPLETED
    private String message;
}