package com.wanderlust.api.services.impl;

// Import DTOs
import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;

import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.repository.WalletRepository;
import com.wanderlust.api.repository.WalletTransactionRepository;
import com.wanderlust.api.services.TransactionService;
import com.wanderlust.api.mapper.TransactionMapper; // Sử dụng Mapper mới

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final WalletTransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional
    public WalletTransaction createTransaction(String userId, TransactionType type, TransactionStatus status, BigDecimal amount, String description, String orderId, String paymentMethod) {

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        WalletTransaction transaction = WalletTransaction.builder()
                .userId(userId)
                .walletId(wallet.getWalletId())
                .type(type)
                .amount(amount)
                .description(description)
                .status(status)
                .bookingId(orderId)
                .paymentMethod(paymentMethod)
                .createdAt(LocalDateTime.now())
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    public Page<TransactionResponseDTO> getUserTransactions(String userId, int page, int size, TransactionType type, TransactionStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<WalletTransaction> transactionPage;

        if (type != null && status != null) {
            transactionPage = transactionRepository.findByUserIdAndType(userId, type, pageable);
        } else if (type != null) {
            transactionPage = transactionRepository.findByUserIdAndType(userId, type, pageable);
        } else if (status != null) {
            transactionPage = transactionRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            transactionPage = transactionRepository.findByUserId(userId, pageable);
        }

        List<TransactionResponseDTO> dtoList = transactionPage.getContent().stream()
                .map(transactionMapper::toTransactionResponseDTO) // Sử dụng TransactionMapper
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, transactionPage.getTotalElements());
    }

    @Override
    @Transactional
    public void updateTransactionStatus(String transactionId, TransactionStatus newStatus, String paymentGatewayRef) {
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        transaction.setStatus(newStatus);
        
        if (paymentGatewayRef != null) {
            transaction.setPaymentGatewayRef(paymentGatewayRef);
        }

        if (newStatus == TransactionStatus.COMPLETED) {
            transaction.setCompletedAt(LocalDateTime.now());
        } else if (newStatus == TransactionStatus.FAILED) {
            transaction.setFailedAt(LocalDateTime.now());
        }

        transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void processAutoRefund(String orderId, String userId, BigDecimal amount, String reason) {
        createTransaction(
                userId,
                TransactionType.REFUND,
                TransactionStatus.COMPLETED,
                amount,
                reason,
                orderId,
                "SYSTEM_AUTO_REFUND"
        );
    }

    @Override
    @Transactional
    public void createPendingRefund(String orderId, String userId, BigDecimal amount, String reason) {
        createTransaction(
                userId,
                TransactionType.REFUND,
                TransactionStatus.PENDING,
                amount,
                reason,
                orderId,
                "USER_REQUEST_REFUND"
        );
    }

    // ==================================================================
    // CÁC HÀM ĐƯỢC MỞ KHÓA NHỜ DTO MỚI
    // ==================================================================

    @Override
    public TransactionDetailDTO getTransactionDetail(String transactionId) {
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));
        
        TransactionDetailDTO detailDTO = transactionMapper.toTransactionDetailDTO(transaction);

        // TODO: Cần gọi OrderService/VendorService để lấy thêm
        // thông tin chi tiết cho serviceName và vendorName
        // if (detailDTO.getOrderId() != null) {
        //    Order order = orderService.findById(detailDTO.getOrderId());
        //    detailDTO.setServiceName(order.getServiceName());
        //    detailDTO.setVendorName(order.getVendorName());
        // }

        return detailDTO;
    }

    @Override
    public TransactionSummaryDTO getTransactionSummary(String userId) {
        List<WalletTransaction> credits = transactionRepository.findCompletedByUserIdAndType(userId, TransactionType.CREDIT);
        List<WalletTransaction> debits = transactionRepository.findCompletedByUserIdAndType(userId, TransactionType.DEBIT);
        List<WalletTransaction> refunds = transactionRepository.findCompletedByUserIdAndType(userId, TransactionType.REFUND);

        // Tính tổng
        BigDecimal totalCredit = calculateTotalAmount(credits);
        BigDecimal totalDebit = calculateTotalAmount(debits);
        BigDecimal totalRefund = calculateTotalAmount(refunds);

        return TransactionSummaryDTO.builder()
                .totalCredit(totalCredit)
                .totalDebit(totalDebit)
                .totalRefund(totalRefund)
                .build();
    }

    /**
     * Helper: Tính tổng số tiền từ danh sách giao dịch
     */
    private BigDecimal calculateTotalAmount(List<WalletTransaction> transactions) {
        return transactions.stream()
                .map(transaction -> (BigDecimal) transaction.getAmount())
                .reduce(BigDecimal.ZERO, (subtotal, amount) -> subtotal.add(amount));
    }
}