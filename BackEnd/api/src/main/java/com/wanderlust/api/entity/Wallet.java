package com.wanderlust.api.entity;

import com.wanderlust.api.entity.types.WalletStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "wallets")
@CompoundIndexes({
    @CompoundIndex(name = "user_wallet_idx", 
                   def = "{'userId': 1}", unique = true)
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Wallet {
    @Id
    private String walletId;
    
    @Indexed(unique = true)
    private String userId;                    // Reference đến User
    
    private BigDecimal balance;               // Số dư hiện tại
    private String currency;                  // Mã tiền tệ (mặc định: "VND")
    private BigDecimal totalTopUp;            // Tổng nạp
    private BigDecimal totalSpent;            // Tổng chi
    private BigDecimal totalRefund;           // Tổng hoàn tiền
    private WalletStatus status;              // ACTIVE, SUSPENDED, CLOSED
    
    @Version
    private Long version;                     // Optimistic locking for concurrency control
    
    private LocalDateTime createdAt;          // Ngày tạo ví
    private LocalDateTime updatedAt;          // Lần cập nhật cuối
}