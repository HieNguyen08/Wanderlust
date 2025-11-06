package com.wanderlust.api.dto;

import lombok.Data;
import java.math.BigDecimal;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.TransactionStatus;

@Data
public class TransactionResponseDTO {
    private String transactionId;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private TransactionStatus status;
    private String orderId;
    private String vendorName;
}