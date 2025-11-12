package com.wanderlust.api.dto.walletDTO;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class PaymentResponseDTO {
    private String transactionId;
    private String orderId;
    private String status; // "COMPLETED", "FAILED"
    private String message;
}