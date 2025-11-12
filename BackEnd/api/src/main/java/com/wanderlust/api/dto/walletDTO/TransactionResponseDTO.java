package com.wanderlust.api.dto.walletDTO; 

import lombok.Data;
import java.math.BigDecimal;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.TransactionStatus;
import java.time.LocalDateTime;

@Data
public class TransactionResponseDTO {
    private String transactionId;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private TransactionStatus status;
    private String booking_Id; 
    private String vendorName; 
    private LocalDateTime createdAt;
}