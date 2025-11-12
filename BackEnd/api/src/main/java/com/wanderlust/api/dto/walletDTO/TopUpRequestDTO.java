package com.wanderlust.api.dto.walletDTO;

import  lombok.Data;
import java.math.BigDecimal;

@Data
public class TopUpRequestDTO {
    private BigDecimal amount;           // Số tiền nạp
    private String paymentMethod;        // "CARD", "MOMO", "VNPAY"
    
    // Validation
    // Min: 10,000 VND
    // Max: 50,000,000 VND
}
