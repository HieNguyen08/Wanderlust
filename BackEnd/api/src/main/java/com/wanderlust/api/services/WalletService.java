package com.wanderlust.api.services;

import com.wanderlust.api.dto.TopUpRequestDTO;
import com.wanderlust.api.dto.WalletResponseDTO;
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.types.TransactionType; // Giả định bạn sẽ tạo enum này

import java.math.BigDecimal;

// Các DTO chưa được cung cấp
import com.wanderlust.api.dto.TopUpResponseDTO;
// import com.wanderlust.api.dto.PaymentCallbackDTO;
// import com.wanderlust.api.dto.PaymentResponseDTO;
// import com.wanderlust.api.dto.WalletPaymentRequestDTO;
import com.wanderlust.api.dto.RefundRequestDTO;

public interface WalletService {

    /**
     * [cite_start]Lấy thông tin ví của user [cite: 14]
     */
    WalletResponseDTO getWalletByUserId(String userId);

    /**
     * [cite_start]Auto-create ví khi user đăng ký [cite: 15]
     */
    Wallet createWalletForNewUser(String userId);

    /**
     * [cite_start]Nạp tiền: tạo pending transaction và redirect đến payment gateway [cite: 16]
     * * TODO: Cần file DTO: TopUpResponseDTO
     */
    // TopUpResponseDTO initiateTopUp(String userId, TopUpRequestDTO topUpRequest);

    /**
     * [cite_start]Xử lý callback từ payment gateway [cite: 17]
     * * TODO: Cần file DTO: PaymentCallbackDTO
     */
    // void processTopUpCallback(PaymentCallbackDTO callbackDTO);

    /**
     * [cite_start]Thanh toán bằng ví (debit) [cite: 18]
     * * TODO: Cần file DTO: PaymentResponseDTO, WalletPaymentRequestDTO
     */
    // PaymentResponseDTO processWalletPayment(String userId, WalletPaymentRequestDTO paymentRequest);

    /**
     * [cite_start]Hoàn tiền vào ví (refund) [cite: 19]
     * * TODO: Cần file DTO: RefundRequestDTO
     */
    // void processRefund(String userId, RefundRequestDTO refundRequest);

    /**
     * [cite_start]Validate đủ tiền trước khi thanh toán [cite: 20]
     */
    boolean hasSufficientBalance(String userId, BigDecimal amount);

    /**
     * [cite_start]Update balance (atomic operation) [cite: 21]
     * * TODO: Cần file Enum: TransactionType
     */
    // void updateBalance(String walletId, BigDecimal amount, TransactionType type);

    /**
     * [cite_start]Tính tổng nạp, chi, hoàn tiền [cite: 22]
     */
    void recalculateWalletStatistics(String walletId);
}
