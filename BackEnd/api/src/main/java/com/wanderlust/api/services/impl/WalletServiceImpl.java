package com.wanderlust.api.services.impl;

// Import các DTOs cần thiết
import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;
import com.wanderlust.api.dto.walletDTO.TopUpRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletResponseDTO;
import com.wanderlust.api.dto.walletDTO.TopUpResponseDTO;
import com.wanderlust.api.dto.walletDTO.PaymentCallbackDTO;
import com.wanderlust.api.dto.walletDTO.PaymentResponseDTO;
import com.wanderlust.api.dto.walletDTO.WalletPaymentRequestDTO;
import com.wanderlust.api.dto.walletDTO.RefundRequestDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawRequestDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawResponseDTO;

// Import Entity, Enum, và Exception
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.WalletStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;

// Import Repository và Service
import com.wanderlust.api.repository.WalletRepository;
import com.wanderlust.api.services.WalletService;
import com.wanderlust.api.services.TransactionService;

// Import các thư viện khác
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    // Đã mở khóa TransactionService
    private final TransactionService transactionService;
    private final ModelMapper modelMapper;

    @Override
    public WalletResponseDTO getWalletByUserId(String userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        return modelMapper.map(wallet, WalletResponseDTO.class);
    }

    @Override
    @Transactional
    public Wallet createWalletForNewUser(String userId) {
        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Wallet already exists for user ID: " + userId);
        }

        Wallet newWallet = Wallet.builder()
                .userId(userId)
                .balance(BigDecimal.ZERO)
                .currency("VND")
                .totalTopUp(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .totalRefund(BigDecimal.ZERO)
                .status(WalletStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return walletRepository.save(newWallet);
    }

    @Override
    public boolean hasSufficientBalance(String userId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        
        // Số dư phải lớn hơn hoặc bằng số tiền cần thanh toán
        return wallet.getBalance().compareTo(amount) >= 0;
    }

    @Override
    @Transactional
    public void recalculateWalletStatistics(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        // Dùng TransactionService để lấy tổng
        TransactionSummaryDTO summary = transactionService.getTransactionSummary(wallet.getUserId());

        wallet.setTotalTopUp(summary.getTotalCredit());
        wallet.setTotalSpent(summary.getTotalDebit());
        wallet.setTotalRefund(summary.getTotalRefund());

        // Tính toán lại số dư dựa trên các tổng
        BigDecimal newBalance = summary.getTotalCredit()
                .add(summary.getTotalRefund())
                .subtract(summary.getTotalDebit());
        
        wallet.setBalance(newBalance);
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    // ==================================================================
    // CÁC TÍNH NĂNG ĐÃ ĐƯỢC MỞ KHÓA
    // ==================================================================

    @Override
    @Transactional
    public TopUpResponseDTO initiateTopUp(String userId, TopUpRequestDTO topUpRequest) {
        // 1. Validate (ví dụ: số tiền phải > 0)
        if (topUpRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Top-up amount must be positive.");
        }

        // 2. Gọi TransactionService.createTransaction(CREDIT, PENDING)
        WalletTransaction transaction = transactionService.createTransaction(
                userId,
                TransactionType.CREDIT,
                TransactionStatus.PENDING,
                topUpRequest.getAmount(),
                "Top-up wallet via " + topUpRequest.getPaymentMethod(),
                null, // Không có orderId cho việc nạp tiền
                topUpRequest.getPaymentMethod()
        );

        // 3. Giả lập việc gọi PaymentGatewayService để lấy URL
        // Trong thực tế, bạn sẽ gọi một service khác ở đây
        String paymentUrl = "https://simulated-payment-gateway.com/pay?tx_id=" + transaction.getTransactionId();

        // 4. Trả về TopUpResponseDTO chứa URL
        return TopUpResponseDTO.builder()
                .transactionId(transaction.getTransactionId())
                .paymentUrl(paymentUrl)
                .build();
    }

    @Override
    @Transactional
    public void processTopUpCallback(PaymentCallbackDTO callbackDTO) {
        // 1. (Bỏ qua) Validate callback (checksum, signature)
        // Trong thực tế, đây là bước quan trọng để bảo mật

        // 2. Lấy chi tiết giao dịch để biết userId và amount
        // Dùng orderId của callback (là transactionId của hệ thống)
        String transactionId = callbackDTO.getOrderId();
        TransactionDetailDTO transactionDetail = transactionService.getTransactionDetail(transactionId);

        // 3. Kiểm tra xem giao dịch có đang PENDING không
        if (transactionDetail.getStatus() != TransactionStatus.PENDING) {
            // Ghi log: Giao dịch đã được xử lý hoặc ở trạng thái không hợp lệ
            return;
        }

        // 4. Xử lý dựa trên status của callback
        if ("00".equals(callbackDTO.getStatus())) {
            // 5. Thành công:
            // Cập nhật trạng thái giao dịch
            transactionService.updateTransactionStatus(
                    transactionId,
                    TransactionStatus.COMPLETED,
                    callbackDTO.getPaymentCode() // Lưu mã giao dịch của cổng thanh toán
            );

            // Cập nhật số dư ví
            Wallet wallet = walletRepository.findByUserId(transactionDetail.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
            
            // Dùng số tiền từ DB (transactionDetail) thay vì từ callback để đảm bảo
            updateBalance(wallet.getWalletId(), transactionDetail.getAmount(), TransactionType.CREDIT);
            
        } else {
            // 6. Thất bại:
            // Cập nhật trạng thái giao dịch
            transactionService.updateTransactionStatus(
                    transactionId,
                    TransactionStatus.FAILED,
                    callbackDTO.getPaymentCode()
            );
        }
    }

    @Override
    @Transactional
    public PaymentResponseDTO processWalletPayment(String userId, WalletPaymentRequestDTO paymentRequest) {
        // 1. Kiểm tra số dư
        if (!hasSufficientBalance(userId, paymentRequest.getAmount())) {
            // Có thể throw exception custom (InsufficientFundsException)
            throw new IllegalStateException("Insufficient funds for this payment.");
        }
        
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        // 2. Nếu đủ: Tạo giao dịch DEBIT, COMPLETED
        WalletTransaction transaction = transactionService.createTransaction(
                userId,
                TransactionType.DEBIT,
                TransactionStatus.COMPLETED,
                paymentRequest.getAmount(),
                paymentRequest.getDescription(),
                paymentRequest.getOrderId(),
                "WALLET_PAYMENT"
        );

        // 3. Cập nhật số dư (truyền vào số tiền âm để trừ)
        updateBalance(wallet.getWalletId(), paymentRequest.getAmount().negate(), TransactionType.DEBIT);

        // 4. Trả về response thành công
        return PaymentResponseDTO.builder()
                .transactionId(transaction.getTransactionId())
                .orderId(transaction.getBookingId())
                .status("COMPLETED")
                .message("Payment successful.")
                .build();
    }

    @Override
    @Transactional
    public void processRefund(String userId, RefundRequestDTO refundRequest) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        // 1. TransactionService tạo giao dịch REFUND, COMPLETED
        // (Giả định `processAutoRefund` làm việc này)
        transactionService.processAutoRefund(
                refundRequest.getOrderId(),
                userId,
                refundRequest.getAmount(),
                refundRequest.getReason()
        );

        // 2. Cập nhật số dư (cộng tiền vào ví)
        updateBalance(wallet.getWalletId(), refundRequest.getAmount(), TransactionType.REFUND);
    }

    @Override
    @Transactional
    public void updateBalance(String walletId, BigDecimal amount, TransactionType type) {
        // Hàm này đảm bảo tính toàn vẹn (atomic) nhờ @Transactional
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found: " + walletId));

        // Cập nhật số dư
        // amount: dương (CREDIT/REFUND), âm (DEBIT/WITHDRAW)
        wallet.setBalance(wallet.getBalance().add(amount));

        // Cập nhật các trường thống kê
        switch (type) {
            case CREDIT:
                wallet.setTotalTopUp(wallet.getTotalTopUp().add(amount));
                break;
            case DEBIT:
                wallet.setTotalSpent(wallet.getTotalSpent().add(amount.abs())); // amount là âm
                break;
            case REFUND:
                wallet.setTotalRefund(wallet.getTotalRefund().add(amount));
                break;
            case WITHDRAW:
                wallet.setTotalSpent(wallet.getTotalSpent().add(amount.abs())); // Coi rút tiền là 'spent'
                break;
        }

        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }
    
    @Override
    @Transactional
    public WithdrawResponseDTO requestWithdraw(String userId, WithdrawRequestDTO withdrawRequest) {
        // 1. Validate số tiền
        if (withdrawRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive.");
        }

        // 2. Kiểm tra số dư
        if (!hasSufficientBalance(userId, withdrawRequest.getAmount())) {
            throw new IllegalStateException("Insufficient funds for this withdrawal.");
        }

        // 3. Tạo mô tả cho giao dịch
        String description = String.format("Withdraw to bank %s - Account: %s (%s)",
                withdrawRequest.getBankCode(),
                withdrawRequest.getBankAccountNumber(),
                withdrawRequest.getAccountName()
        );

        // 4. TransactionService.createTransaction(WITHDRAW, PENDING)
        // Giao dịch này ở trạng thái PENDING, chờ admin duyệt
        WalletTransaction transaction = transactionService.createTransaction(
                userId,
                TransactionType.WITHDRAW, // Giả định bạn có Enum TransactionType.WITHDRAW
                TransactionStatus.PENDING,  // Trạng thái chờ duyệt
                withdrawRequest.getAmount(),
                description,
                null, // Không có orderId liên quan
                withdrawRequest.getBankCode() // Lưu mã ngân hàng làm paymentMethod
        );

        // 5. Trả về WithdrawResponseDTO
        return WithdrawResponseDTO.builder()
                .withdrawId(transaction.getTransactionId())
                .status("PENDING")
                .message("Withdrawal request received and is pending approval.")
                .build();
    }
}