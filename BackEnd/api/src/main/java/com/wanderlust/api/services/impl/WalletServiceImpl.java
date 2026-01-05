package com.wanderlust.api.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.dto.walletDTO.PaymentCallbackDTO;
import com.wanderlust.api.dto.walletDTO.PaymentResponseDTO;
import com.wanderlust.api.dto.walletDTO.TopUpRequestDTO;
import com.wanderlust.api.dto.walletDTO.TopUpResponseDTO;
import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;
import com.wanderlust.api.dto.walletDTO.WalletPaymentRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletRefundRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletResponseDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawRequestDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawResponseDTO;
import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.WalletStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.repository.PaymentRepository;
import com.wanderlust.api.repository.WalletRepository;
import com.wanderlust.api.services.BookingService;
import com.wanderlust.api.services.PaymentService;
import com.wanderlust.api.services.TransactionService;
import com.wanderlust.api.services.WalletService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final TransactionService transactionService;
    private final ModelMapper modelMapper;
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    // Constructor với @Lazy để tránh circular dependency
    public WalletServiceImpl(
            WalletRepository walletRepository,
            TransactionService transactionService,
            ModelMapper modelMapper,
            PaymentRepository paymentRepository,
            BookingService bookingService,
            @Lazy PaymentService paymentService) {
        this.walletRepository = walletRepository;
        this.transactionService = transactionService;
        this.modelMapper = modelMapper;
        this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    @Override
    public WalletResponseDTO getWalletByUserId(String userId) {
        // Tự động tạo wallet nếu chưa có (cho user cũ)
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    System.out.println("⚠️ Wallet not found for user: " + userId + ". Creating new wallet...");
                    return createWalletForNewUser(userId);
                });
        return modelMapper.map(wallet, WalletResponseDTO.class);
    }

    @Override
    @Transactional
    public Wallet createWalletForNewUser(String userId) {
        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Wallet already exists for user ID: " + userId);
        }
        Wallet newWallet = Wallet.builder()
                .userId(userId).balance(BigDecimal.ZERO).currency("VND")
                .totalTopUp(BigDecimal.ZERO).totalSpent(BigDecimal.ZERO).totalRefund(BigDecimal.ZERO)
                .status(WalletStatus.ACTIVE)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
        return walletRepository.save(newWallet);
    }

    @Override
    public boolean hasSufficientBalance(String userId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        return wallet.getBalance().compareTo(amount) >= 0;
    }

    @Override
    @Transactional
    public void recalculateWalletStatistics(String walletId) {
        // (Giữ nguyên logic từ file gốc)
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        TransactionSummaryDTO summary = transactionService.getTransactionSummary(wallet.getUserId());
        wallet.setTotalTopUp(summary.getTotalCredit());
        wallet.setTotalSpent(summary.getTotalDebit());
        wallet.setTotalRefund(summary.getTotalRefund());
        BigDecimal newBalance = summary.getTotalCredit()
                .add(summary.getTotalRefund())
                .subtract(summary.getTotalDebit());
        wallet.setBalance(newBalance);
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    @Override
    @Transactional
    public TopUpResponseDTO initiateTopUp(String userId, TopUpRequestDTO topUpRequest) {
        if (topUpRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Top-up amount must be positive.");
        }

        // 1. Tạo Transaction Pending trong ví
        WalletTransaction transaction = transactionService.createTransaction(
                userId, TransactionType.CREDIT, TransactionStatus.PENDING,
                topUpRequest.getAmount(), "Top-up wallet via " + topUpRequest.getPaymentMethod(),
                null, topUpRequest.getPaymentMethod());

        // Đặt bookingId đặc biệt để PaymentService nhận diện luồng nạp ví
        String topUpBookingId = "TOPUP-" + transaction.getTransactionId();

        // 2. Tạo Payment request gửi sang PaymentService (để gọi Stripe)
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setUserId(userId);
        paymentDTO.setAmount(topUpRequest.getAmount());
        paymentDTO.setCurrency("VND");
        paymentDTO.setBookingId(topUpBookingId);
        // Đồng bộ transactionId giữa Payment và WalletTransaction để dễ truy vết
        paymentDTO.setTransactionId(transaction.getTransactionId());
        
        // Map phương thức thanh toán từ string sang Enum
        try {
            paymentDTO.setPaymentMethod(PaymentMethod.valueOf(topUpRequest.getPaymentMethod())); 
        } catch (Exception e) {
            paymentDTO.setPaymentMethod(PaymentMethod.STRIPE); // Mặc định fallback
        }
        

        // 3. Gọi PaymentService để lấy link thanh toán
        PaymentDTO initiatedPayment = paymentService.initiatePayment(paymentDTO);
        
        // 4. Lấy URL từ metadata
        String paymentUrl = "";
        if (initiatedPayment.getMetadata() != null && initiatedPayment.getMetadata().containsKey("paymentUrl")) {
            paymentUrl = (String) initiatedPayment.getMetadata().get("paymentUrl");
        } else {
            // Fallback nếu không lấy được URL (hiếm khi xảy ra nếu config đúng)
             paymentUrl = "error-generating-link";
        }

        return TopUpResponseDTO.builder()
                .transactionId(transaction.getTransactionId())
                .paymentUrl(paymentUrl)
                .build();
    }

    @Override
    @Transactional
    public void processTopUpCallback(PaymentCallbackDTO callbackDTO) {
        // Hàm này có thể giữ lại làm fallback, nhưng luồng chính giờ sẽ được 
        // xử lý tự động trong PaymentService.handleGatewayCallback
        String transactionId = callbackDTO.getOrderId();
        TransactionDetailDTO transactionDetail = transactionService.getTransactionDetail(transactionId);
        if (transactionDetail.getStatus() != TransactionStatus.PENDING) {
            return;
        }
        if ("00".equals(callbackDTO.getStatus())) {
            transactionService.updateTransactionStatus(
                    transactionId, TransactionStatus.COMPLETED, callbackDTO.getPaymentCode());
            Wallet wallet = walletRepository.findByUserId(transactionDetail.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
            updateBalance(wallet.getWalletId(), transactionDetail.getAmount(), TransactionType.CREDIT);
        } else {
            transactionService.updateTransactionStatus(
                    transactionId, TransactionStatus.FAILED, callbackDTO.getPaymentCode());
        }
    }

    // --- ACTION: Thanh toán bằng ví (CẬP NHẬT) ---
    @Override
    @Transactional
    public PaymentResponseDTO processWalletPayment(String userId, WalletPaymentRequestDTO paymentRequest) {
        // 1. Kiểm tra số dư
        if (!hasSufficientBalance(userId, paymentRequest.getAmount())) {
            throw new IllegalStateException("Insufficient funds for this payment.");
        }
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        // 2. Tạo giao dịch DEBIT (trừ tiền)
        WalletTransaction transaction = transactionService.createTransaction(
                userId, TransactionType.DEBIT, TransactionStatus.COMPLETED,
                paymentRequest.getAmount(), paymentRequest.getDescription(),
                paymentRequest.getOrderId(), "WALLET_PAYMENT");

        // 3. Cập nhật số dư (truyền số âm)
        updateBalance(wallet.getWalletId(), paymentRequest.getAmount().negate(), TransactionType.DEBIT);

        // 4. Tạo bản ghi Payment log
        Payment paymentLog = new Payment();
        paymentLog.setBookingId(paymentRequest.getOrderId());
        paymentLog.setUserId(userId);
        paymentLog.setAmount(paymentRequest.getAmount());
        paymentLog.setCurrency("VND");
        paymentLog.setPaymentMethod(PaymentMethod.WALLET);
        paymentLog.setPaymentGateway("WANDERLUST_WALLET");
        paymentLog.setTransactionId(transaction.getTransactionId());
        paymentLog.setStatus(PaymentStatus.COMPLETED);
        paymentLog.setPaidAt(LocalDateTime.now());
        paymentLog.setCreatedAt(LocalDateTime.now());
        paymentLog.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(paymentLog);

        // === TÍCH HỢP: GỌI BOOKING SERVICE ===
        // Tự động xác nhận đơn hàng khi thanh toán thành công
        try {
            bookingService.confirmBooking(paymentRequest.getOrderId());
        } catch (Exception e) {
            System.err.println("Failed to confirm booking: " + paymentRequest.getOrderId() + " after wallet payment.");
            // (Cân nhắc: có nên rollback giao dịch ví nếu confirm booking thất bại?)
        }
        // ===================================

        // 5. Trả về response
        return PaymentResponseDTO.builder()
                .transactionId(transaction.getTransactionId())
                .orderId(transaction.getBookingId())
                .status("COMPLETED")
                .message("Payment successful.")
                .build();
    }

    // --- ACTION: Xử lý Refund (Giữ nguyên) ---
    // Logic này đã đúng: gọi TransactionService [cite: 30]
    @Override
    @Transactional
    public void processRefund(String userId, WalletRefundRequestDTO refundRequest) { //
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        // 1. TransactionService tạo giao dịch REFUND (cộng tiền)
        transactionService.processAutoRefund(
                refundRequest.getOrderId(),
                userId,
                refundRequest.getAmount(),
                refundRequest.getReason());

        // 2. Cập nhật số dư (cộng tiền vào ví)
        updateBalance(wallet.getWalletId(), refundRequest.getAmount(), TransactionType.REFUND);
    }

    /**
     * ✅ SAFE: Atomic balance update with optimistic locking + retry
     */
    @Override
    @Retryable(
        value = OptimisticLockingFailureException.class,
        maxAttempts = 5,  // Higher retries for financial operations
        backoff = @Backoff(delay = 50, multiplier = 2)
    )
    @Transactional
    public void updateBalance(String walletId, BigDecimal amount, TransactionType type) {
        // (Giữ nguyên logic từ file gốc)
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found: " + walletId));
        wallet.setBalance(wallet.getBalance().add(amount));
        switch (type) {
            case CREDIT:
                wallet.setTotalTopUp(wallet.getTotalTopUp().add(amount));
                break;
            case DEBIT:
                wallet.setTotalSpent(wallet.getTotalSpent().add(amount.abs()));
                break;
            case REFUND:
                wallet.setTotalRefund(wallet.getTotalRefund().add(amount));
                break;
            case WITHDRAW:
                wallet.setTotalSpent(wallet.getTotalSpent().add(amount.abs()));
                break;
        }
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    @Override
    @Transactional
    public WithdrawResponseDTO requestWithdraw(String userId, WithdrawRequestDTO withdrawRequest) {
        // (Giữ nguyên logic từ file gốc)
        if (withdrawRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive.");
        }
        if (!hasSufficientBalance(userId, withdrawRequest.getAmount())) {
            throw new IllegalStateException("Insufficient funds for this withdrawal.");
        }
        String description = String.format("Withdraw to bank %s - Account: %s (%s)",
                withdrawRequest.getBankCode(), withdrawRequest.getBankAccountNumber(),
                withdrawRequest.getAccountName());
        WalletTransaction transaction = transactionService.createTransaction(
                userId, TransactionType.WITHDRAW, TransactionStatus.PENDING,
                withdrawRequest.getAmount(), description,
                null, withdrawRequest.getBankCode());
        return WithdrawResponseDTO.builder()
                .withdrawId(transaction.getTransactionId())
                .status("PENDING")
                .message("Withdrawal request received and is pending approval.")
                .build();
    }
}