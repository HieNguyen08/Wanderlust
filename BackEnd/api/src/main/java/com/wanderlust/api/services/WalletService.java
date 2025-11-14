package com.wanderlust.api.services;

// Import các DTO từ package mới
import com.wanderlust.api.dto.walletDTO.TopUpRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletResponseDTO;
import com.wanderlust.api.dto.walletDTO.TopUpResponseDTO;
import com.wanderlust.api.dto.walletDTO.PaymentCallbackDTO;
import com.wanderlust.api.dto.walletDTO.PaymentResponseDTO;
import com.wanderlust.api.dto.walletDTO.WalletPaymentRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletRefundRequestDTO;
// Import DTOs mới cho tính năng rút tiền
import com.wanderlust.api.dto.walletDTO.WithdrawRequestDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawResponseDTO;

// Import Entity và Enum
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.types.TransactionType;

import java.math.BigDecimal;

public interface WalletService {

    /**
     * Lấy thông tin ví của user
     */
    WalletResponseDTO getWalletByUserId(String userId);

    /**
     * Auto-create ví khi user đăng ký
     */
    Wallet createWalletForNewUser(String userId);

    /**
     * Nạp tiền: tạo pending transaction và redirect đến payment gateway
     */
    TopUpResponseDTO initiateTopUp(String userId, TopUpRequestDTO topUpRequest);

    /**
     * Xử lý callback từ payment gateway
     */
    void processTopUpCallback(PaymentCallbackDTO callbackDTO);

    /**
     * Thanh toán bằng ví (debit)
     */
    PaymentResponseDTO processWalletPayment(String userId, WalletPaymentRequestDTO paymentRequest);

    /**
     * Hoàn tiền vào ví (refund)
     */
    void processRefund(String userId, WalletRefundRequestDTO refundRequest);

    /**
     * Validate đủ tiền trước khi thanh toán
     */
    boolean hasSufficientBalance(String userId, BigDecimal amount);

    /**
     * Update balance (atomic operation)
     */
    void updateBalance(String walletId, BigDecimal amount, TransactionType type);

    /**
     * Tính tổng nạp, chi, hoàn tiền
     */
    void recalculateWalletStatistics(String walletId);

    /**
     * [MỚI] Yêu cầu rút tiền
     */
    WithdrawResponseDTO requestWithdraw(String userId, WithdrawRequestDTO withdrawRequest);
}