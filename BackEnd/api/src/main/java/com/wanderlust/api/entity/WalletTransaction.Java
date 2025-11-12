package com.wanderlust.api.entity;

import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



import java.math.BigDecimal;
import java.time.LocalDateTime;



@Document(collection = "wallet_transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletTransaction {
    @Id
    private String transactionId;
    
    private String walletId;                  // Reference đến Wallet
    private String userId;                    // Reference đến User (denormalized)

    private TransactionType type;             // CREDIT, DEBIT, REFUND
    private BigDecimal amount;                // Số tiền giao dịch
    private String description;               // Mô tả giao dịch
    
    private TransactionStatus status;         // COMPLETED, PENDING, FAILED
    
    // Metadata
    private String bookingId;                   // ID đơn hàng liên quan (nếu có)
    private String paymentMethod;             // CARD, MOMO, VNPAY (với topup)
    private String paymentGatewayRef;         // Reference từ payment gateway
    
    // Timestamps
    private LocalDateTime createdAt;          // Thời gian tạo giao dịch
    private LocalDateTime completedAt;        // Thời gian hoàn thành
    private LocalDateTime failedAt;           // Thời gian thất bại (nếu có)
    
    // Admin notes (cho refund manual)
    private String adminNotes;                // Ghi chú của admin khi xử lý refund
    private String processedBy;               // Admin ID xử lý refund
}
