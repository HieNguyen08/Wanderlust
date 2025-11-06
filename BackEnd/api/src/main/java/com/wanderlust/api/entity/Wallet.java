package com.wanderlust.api.entity;

import com.wanderlust.api.entity.types.WalletStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



import java.math.BigDecimal;
import java.time.LocalDateTime;



@Document(collection = "wallets")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Wallet {
    @Id
    private String walletId;
    private String userId;                    // Reference đến User
    private BigDecimal balance;               // Số dư hiện tại (VD: 2,450,000)
    private String currency;                  // Mã tiền tệ (mặc định: "VND")
    private BigDecimal totalTopUp;            // Tổng nạp (VD: 1,100,000)
    private BigDecimal totalSpent;            // Tổng chi (VD: 850,000)
    private BigDecimal totalRefund;           // Tổng hoàn tiền (VD: 2,200,000)
    private WalletStatus status;              // ACTIVE, SUSPENDED, CLOSED
    private LocalDateTime createdAt;          // Ngày tạo ví
    private LocalDateTime updatedAt;          // Lần cập nhật cuối
}