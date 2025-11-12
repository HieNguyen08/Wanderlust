package com.wanderlust.api.services;

import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;

import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

public interface TransactionService {

    /**
     * [cite_start]Tạo transaction mới (CREDIT/DEBIT/REFUND) [cite: 25]
     */
    WalletTransaction createTransaction(
            String userId,
            TransactionType type,
            TransactionStatus status,
            BigDecimal amount,
            String description,
            String orderId,
            String paymentMethod
    );

    /**
     * [cite_start]Lấy danh sách transactions với phân trang và filter [cite: 26]
     */
    Page<TransactionResponseDTO> getUserTransactions(
            String userId,
            int page,
            int size,
            TransactionType type,
            TransactionStatus status
    );

    /**
     * [cite_start]Lấy chi tiết một transaction [cite: 27]
     */
    TransactionDetailDTO getTransactionDetail(String transactionId);

    /**
     * [cite_start]Update transaction status (PENDING -> COMPLETED/FAILED) [cite: 28]
     */
    void updateTransactionStatus(String transactionId, TransactionStatus newStatus, String paymentGatewayRef);

    /**
     * [cite_start]Lấy tổng quan: totalCredit, totalDebit, totalRefund [cite: 29]
     */
    TransactionSummaryDTO getTransactionSummary(String userId);

    /**
     * [cite_start]Xử lý refund tự động (khi vendor cancel order) [cite: 30]
     */
    void processAutoRefund(String orderId, String userId, BigDecimal amount, String reason);

    /**
     * [cite_start]Tạo pending refund (khi user request refund) [cite: 31]
     */
    void createPendingRefund(String orderId, String userId, BigDecimal amount, String reason);
}