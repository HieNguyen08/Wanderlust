package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.WalletRepository;
import com.wanderlust.api.repository.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service xử lý logic chuyển tiền giữa các ví
 * - Từ user -> admin khi booking
 * - Từ admin -> vendor khi booking complete
 * - Từ admin/vendor -> user khi refund
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MoneyTransferService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final BookingRepository bookingRepository;
    private final PromotionRepository promotionRepository;
    private final ApplicationEventPublisher eventPublisher;

    // ID của admin (hardcoded theo yêu cầu)
    private static final String ADMIN_USER_ID = "6933449352d16736c044ad44";
    private static final String ADMIN_WALLET_ID = "6933449352d16736c044ad45";
    private static final BigDecimal COMMISSION_RATE = new BigDecimal("0.05"); // 5%

    /**
     * Xử lý thanh toán từ user -> admin
     * Được gọi khi user thanh toán booking (bằng ví hoặc Stripe)
     */
    @Transactional
    public void processBookingPayment(String bookingId, String userId, String paymentMethod) {
        log.info("Processing booking payment: bookingId={}, userId={}, method={}", bookingId, userId, paymentMethod);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        Wallet adminWallet = walletRepository.findById(ADMIN_WALLET_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin Wallet", "id", ADMIN_WALLET_ID));

        BigDecimal amount = booking.getTotalPrice();

        // Wallet payment: subtract from user, add to admin
        if ("WALLET".equalsIgnoreCase(paymentMethod)) {
            Wallet userWallet = walletRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Wallet for user", "userId", userId));

            BigDecimal newUserBalance = userWallet.getBalance().subtract(amount);
            if (newUserBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Insufficient balance in user wallet");
            }
            userWallet.setBalance(newUserBalance);
            userWallet.setTotalSpent(userWallet.getTotalSpent().add(amount));
            walletRepository.save(userWallet);

            adminWallet.setBalance(adminWallet.getBalance().add(amount));
            adminWallet.setTotalTopUp(adminWallet.getTotalTopUp().add(amount));
            walletRepository.save(adminWallet);

            WalletTransaction userTransaction = WalletTransaction.builder()
                    .walletId(userWallet.getWalletId())
                    .userId(userId)
                    .type(TransactionType.DEBIT)
                    .amount(amount)
                    .description("Payment for booking " + booking.getBookingCode())
                    .status(TransactionStatus.COMPLETED)
                    .bookingId(bookingId)
                    .paymentMethod(paymentMethod)
                    .fromWalletId(userWallet.getWalletId())
                    .toWalletId(adminWallet.getWalletId())
                    .voucherCode(booking.getVoucherCode())
                    .voucherDiscount(booking.getVoucherDiscount())
                    .createdAt(LocalDateTime.now())
                    .completedAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(userTransaction);

            WalletTransaction adminTransaction = WalletTransaction.builder()
                    .walletId(adminWallet.getWalletId())
                    .userId(ADMIN_USER_ID)
                    .type(TransactionType.CREDIT)
                    .amount(amount)
                    .description("Received payment for booking " + booking.getBookingCode())
                    .status(TransactionStatus.COMPLETED)
                    .bookingId(bookingId)
                    .paymentMethod(paymentMethod)
                    .fromWalletId(userWallet.getWalletId())
                    .toWalletId(adminWallet.getWalletId())
                    .relatedUserId(userId)
                    .createdAt(LocalDateTime.now())
                    .completedAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(adminTransaction);

        } else {
            // Card/Stripe payment: user wallet untouched, credit admin wallet
            adminWallet.setBalance(adminWallet.getBalance().add(amount));
            adminWallet.setTotalTopUp(adminWallet.getTotalTopUp().add(amount));
            walletRepository.save(adminWallet);

            WalletTransaction adminTransaction = WalletTransaction.builder()
                    .walletId(adminWallet.getWalletId())
                    .userId(ADMIN_USER_ID)
                    .type(TransactionType.CREDIT)
                    .amount(amount)
                    .description("Card payment for booking " + booking.getBookingCode())
                    .status(TransactionStatus.COMPLETED)
                    .bookingId(bookingId)
                    .paymentMethod(paymentMethod)
                    .fromWalletId(null)
                    .toWalletId(adminWallet.getWalletId())
                    .relatedUserId(userId)
                    .voucherCode(booking.getVoucherCode())
                    .voucherDiscount(booking.getVoucherDiscount())
                    .createdAt(LocalDateTime.now())
                    .completedAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(adminTransaction);
        }

        log.info("✅ Booking payment processed: {} VND transferred from user {} to admin", amount, userId);
    }

    /**
     * Xử lý chuyển tiền từ admin -> vendor sau khi booking complete
     * Được gọi từ BookingScheduler hoặc khi user confirm booking
     */
    @Transactional
    public void processBookingCompletionTransfer(String bookingId) {
        log.info("Processing booking completion transfer: bookingId={}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        BookingType bookingType = booking.getBookingType();
        String vendorId = booking.getVendorId();

        // Nếu là FLIGHT hoặc không có vendor -> tiền ở lại admin, không transfer
        if (bookingType == BookingType.FLIGHT || vendorId == null || vendorId.equals(ADMIN_USER_ID)) {
            log.info("Booking {} is FLIGHT or has no vendor - money stays with admin", bookingId);
            return;
        }

        // Lấy ví admin và vendor
        Wallet adminWallet = walletRepository.findById(ADMIN_WALLET_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin Wallet", "id", ADMIN_WALLET_ID));

        Wallet vendorWallet = walletRepository.findByUserId(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor Wallet", "userId", vendorId));

        BigDecimal totalAmount = booking.getTotalPrice();
        BigDecimal voucherDiscount = booking.getVoucherDiscount() != null ? booking.getVoucherDiscount() : BigDecimal.ZERO;

        // Tính commission dựa trên basePrice (trước khi giảm giá)
        BigDecimal basePrice = totalAmount.add(voucherDiscount);
        BigDecimal commission = basePrice.multiply(COMMISSION_RATE);

        // Xử lý voucher
        BigDecimal adminVoucherCost = BigDecimal.ZERO;
        BigDecimal vendorVoucherCost = BigDecimal.ZERO;

        if (booking.getVoucherCode() != null) {
            Promotion promotion = promotionRepository.findByCode(booking.getVoucherCode()).orElse(null);
            if (promotion != null) {
                if (Boolean.TRUE.equals(promotion.getAdminCreateCheck())) {
                    // Admin tạo voucher -> admin bù tiền
                    adminVoucherCost = voucherDiscount;
                } else {
                    // Vendor tạo voucher -> vendor tự chịu
                    vendorVoucherCost = voucherDiscount;
                }
            }
        }

        // Số tiền vendor nhận được = totalAmount (đã trừ voucher) - commission + adminVoucherCost
        BigDecimal vendorReceives = totalAmount.subtract(commission).add(adminVoucherCost);

        // Admin giữ lại commission và trừ đi adminVoucherCost
        BigDecimal adminKeeps = commission.subtract(adminVoucherCost);

        // Trừ tiền từ ví admin
        adminWallet.setBalance(adminWallet.getBalance().subtract(vendorReceives));
        walletRepository.save(adminWallet);

        // Cộng tiền vào ví vendor
        vendorWallet.setBalance(vendorWallet.getBalance().add(vendorReceives));
        vendorWallet.setTotalTopUp(vendorWallet.getTotalTopUp().add(vendorReceives));
        walletRepository.save(vendorWallet);

        // Tạo transaction cho admin (DEBIT - chuyển cho vendor)
        WalletTransaction adminTransaction = WalletTransaction.builder()
                .walletId(adminWallet.getWalletId())
                .userId(ADMIN_USER_ID)
                .type(TransactionType.DEBIT)
                .amount(vendorReceives)
                .description("Transfer to vendor for completed booking " + booking.getBookingCode())
                .status(TransactionStatus.COMPLETED)
                .bookingId(bookingId)
                .fromWalletId(adminWallet.getWalletId())
                .toWalletId(vendorWallet.getWalletId())
                .relatedUserId(vendorId)
                .commissionAmount(commission)
                .commissionPaidTo(ADMIN_USER_ID)
                .voucherCode(booking.getVoucherCode())
                .voucherDiscount(voucherDiscount)
                .voucherProviderId(adminVoucherCost.compareTo(BigDecimal.ZERO) > 0 ? ADMIN_USER_ID : vendorId)
                .createdAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();
        transactionRepository.save(adminTransaction);

        // Tạo transaction cho vendor (CREDIT)
        WalletTransaction vendorTransaction = WalletTransaction.builder()
                .walletId(vendorWallet.getWalletId())
                .userId(vendorId)
                .type(TransactionType.CREDIT)
                .amount(vendorReceives)
                .description("Received payment for completed booking " + booking.getBookingCode())
                .status(TransactionStatus.COMPLETED)
                .bookingId(bookingId)
                .fromWalletId(adminWallet.getWalletId())
                .toWalletId(vendorWallet.getWalletId())
                .relatedUserId(ADMIN_USER_ID)
                .commissionAmount(commission)
                .commissionPaidTo(ADMIN_USER_ID)
                .voucherCode(booking.getVoucherCode())
                .voucherDiscount(vendorVoucherCost)
                .voucherProviderId(vendorVoucherCost.compareTo(BigDecimal.ZERO) > 0 ? vendorId : null)
                .createdAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();
        transactionRepository.save(vendorTransaction);

        log.info("✅ Booking completion transfer: {} VND to vendor {}, commission {} VND kept by admin",
                vendorReceives, vendorId, commission);
    }

    /**
     * Xử lý hoàn tiền từ admin -> user
     * Được gọi khi admin/vendor approve refund request
     */
    @Transactional
    public void processRefund(String bookingId, String approvedBy, boolean isVendorApproval) {
        log.info("Processing refund: bookingId={}, approvedBy={}, isVendor={}", bookingId, approvedBy, isVendorApproval);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        String userId = booking.getUserId();
        String vendorId = booking.getVendorId();
        BigDecimal refundAmount = booking.getTotalPrice();

        Wallet adminWallet = walletRepository.findById(ADMIN_WALLET_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin Wallet", "id", ADMIN_WALLET_ID));

        Wallet userWallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Wallet", "userId", userId));

        // Trừ tiền từ ví admin
        adminWallet.setBalance(adminWallet.getBalance().subtract(refundAmount));
        adminWallet.setTotalRefund(adminWallet.getTotalRefund().add(refundAmount));
        walletRepository.save(adminWallet);

        // Cộng tiền vào ví user
        userWallet.setBalance(userWallet.getBalance().add(refundAmount));
        userWallet.setTotalRefund(userWallet.getTotalRefund().add(refundAmount));
        walletRepository.save(userWallet);

        // Tạo transaction refund cho admin (DEBIT)
        WalletTransaction adminTransaction = WalletTransaction.builder()
                .walletId(adminWallet.getWalletId())
                .userId(ADMIN_USER_ID)
                .type(TransactionType.REFUND)
                .amount(refundAmount)
                .description("Refund for booking " + booking.getBookingCode())
                .status(TransactionStatus.COMPLETED)
                .bookingId(bookingId)
                .fromWalletId(adminWallet.getWalletId())
                .toWalletId(userWallet.getWalletId())
                .relatedUserId(userId)
                .processedBy(approvedBy)
                .createdAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();
        transactionRepository.save(adminTransaction);

        // Tạo transaction refund cho user (CREDIT)
        WalletTransaction userTransaction = WalletTransaction.builder()
                .walletId(userWallet.getWalletId())
                .userId(userId)
                .type(TransactionType.REFUND)
                .amount(refundAmount)
                .description("Refund for booking " + booking.getBookingCode())
                .status(TransactionStatus.COMPLETED)
                .bookingId(bookingId)
                .fromWalletId(adminWallet.getWalletId())
                .toWalletId(userWallet.getWalletId())
                .relatedUserId(ADMIN_USER_ID)
                .processedBy(approvedBy)
                .createdAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();
        transactionRepository.save(userTransaction);

        // Nếu admin approve và có vendor -> vendor bị phạt 5%
        if (!isVendorApproval && vendorId != null && !vendorId.equals(ADMIN_USER_ID)) {
            BigDecimal penalty = refundAmount.multiply(COMMISSION_RATE);

            Wallet vendorWallet = walletRepository.findByUserId(vendorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor Wallet", "userId", vendorId));

            // Trừ tiền phạt từ vendor
            vendorWallet.setBalance(vendorWallet.getBalance().subtract(penalty));
            walletRepository.save(vendorWallet);

            // Cộng tiền phạt vào admin
            adminWallet.setBalance(adminWallet.getBalance().add(penalty));
            walletRepository.save(adminWallet);

            // Tạo transaction penalty cho vendor
            WalletTransaction vendorPenalty = WalletTransaction.builder()
                    .walletId(vendorWallet.getWalletId())
                    .userId(vendorId)
                    .type(TransactionType.DEBIT)
                    .amount(penalty)
                    .description("Refund penalty for booking " + booking.getBookingCode())
                    .status(TransactionStatus.COMPLETED)
                    .bookingId(bookingId)
                    .fromWalletId(vendorWallet.getWalletId())
                    .toWalletId(adminWallet.getWalletId())
                    .relatedUserId(ADMIN_USER_ID)
                    .commissionAmount(penalty)
                    .commissionPaidTo(ADMIN_USER_ID)
                    .processedBy(approvedBy)
                    .adminNotes("Penalty for admin-approved refund")
                    .createdAt(LocalDateTime.now())
                    .completedAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(vendorPenalty);

            log.info("⚠️ Vendor {} penalized {} VND for admin-approved refund", vendorId, penalty);
        }

        log.info("✅ Refund processed: {} VND returned to user {}", refundAmount, userId);
    }
}
