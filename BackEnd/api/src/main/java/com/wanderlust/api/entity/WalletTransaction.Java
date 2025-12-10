package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



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

    private TransactionType type;             // CREDIT, DEBIT, REFUND, WITHDRAW
    private BigDecimal amount;                // Số tiền giao dịch
    private String description;               // Mô tả giao dịch
    
    private TransactionStatus status;         // COMPLETED, PENDING, FAILED
    
    // Metadata
    private String bookingId;                   // ID đơn hàng liên quan (nếu có)
    private String paymentMethod;             // CARD, WALLET, STRIPE (phương thức thanh toán)
    private String paymentGatewayRef;         // Reference từ payment gateway
    
    // Transfer info - Cho các giao dịch chuyển tiền giữa ví
    private String fromWalletId;              // Ví nguồn (khi chuyển tiền)
    private String toWalletId;                // Ví đích (khi chuyển tiền)
    private String relatedUserId;             // User liên quan (vendor/admin)
    
    // Commission tracking
    private BigDecimal commissionAmount;      // Số tiền hoa hồng (5% cho admin)
    private String commissionPaidTo;          // ID của người nhận hoa hồng
    
    // Voucher info
    private String voucherCode;               // Mã voucher được sử dụng
    private BigDecimal voucherDiscount;       // Số tiền giảm giá từ voucher
    private String voucherProviderId;         // ID người cung cấp voucher (admin/vendor)
    
    // Timestamps
    private LocalDateTime createdAt;          // Thời gian tạo giao dịch
    private LocalDateTime completedAt;        // Thời gian hoàn thành
    private LocalDateTime failedAt;           // Thời gian thất bại (nếu có)
    
    // Admin notes (cho refund manual)
    private String adminNotes;                // Ghi chú của admin khi xử lý refund
    private String processedBy;               // Admin ID xử lý refund
}
