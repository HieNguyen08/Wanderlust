package com.wanderlust.api.listener;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.wanderlust.api.services.TransactionService;
import com.wanderlust.api.services.UserProfileService;
import com.wanderlust.api.services.WalletService;
// Import này là cần thiết cho việc update balance
import com.wanderlust.api.entity.types.TransactionType; 

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletEventListener {

    private final UserProfileService userProfileService;
    private final TransactionService transactionService;
    private final WalletService walletService; // Cần để cập nhật balance

    /**
     * Lắng nghe sự kiện khi User booking thành công 
     */
    @EventListener
    public void onBookingCompleted(BookingCompletedEvent event) {
        log.info("Received BookingCompletedEvent for user: {}", event.getUserId());
        
        // 1. Cộng điểm loyalty (Dựa trên UserProfileService)
        userProfileService.addLoyaltyPoints(event.getUserId(), event.getSpentAmount());
        
        // 2. (Ghi chú) Việc trừ tiền (DEBIT) đã được xử lý TRƯỚC KHI sự kiện này diễn ra.
        // Sự kiện này chỉ xử lý các tác vụ "sau khi đã thành công" (post-completion).
    }

    /**
     * Lắng nghe sự kiện khi Vendor hủy đơn (Hoàn tiền tự động) 
     */
    @EventListener
    public void onOrderCancelledByVendor(OrderCancelledEvent event) {
        log.info("Received OrderCancelledByVendor event for order: {}", event.getOrderId());
        
        // 1. Tạo giao dịch hoàn tiền tự động (COMPLETED) (Dựa trên TransactionService)
        transactionService.processAutoRefund(
                event.getOrderId(),
                event.getUserId(),
                event.getAmount(),
                "Order cancelled by vendor"
        );
        
        // 2. Cập nhật (cộng) tiền vào ví (Dựa trên WalletService)
        // [ĐÃ IMPLEMENT] Kích hoạt hàm updateBalance trong WalletService
        walletService.updateBalance(event.getWalletId(), event.getAmount(), TransactionType.REFUND);
        
        log.info("Processed auto-refund for order: {}. Wallet {} credited with {}", 
                 event.getOrderId(), event.getWalletId(), event.getAmount());
    }

    /**
     * Lắng nghe sự kiện khi User hủy đơn (Tạo yêu cầu hoàn tiền) 
     */
    @EventListener
    public void onOrderCancelledByUser(OrderCancelledEvent event) {
        log.info("Received OrderCancelledByUser event for order: {}", event.getOrderId());

        // 1. Tạo giao dịch hoàn tiền (PENDING) (Dựa trên TransactionService)
        // Admin sẽ duyệt yêu cầu này sau
        transactionService.createPendingRefund(
                event.getOrderId(),
                event.getUserId(),
                event.getAmount(),
                "User cancellation request"
        );
        
        log.info("Created pending refund request for order: {}", event.getOrderId());
    }

    // ==================================================================
    // CÁC LỚP EVENT (GIẢ ĐỊNH)
    // Các lớp này được định nghĩa ở service nguồn (ví dụ: BookingService)
    // Hoặc được định nghĩa tại một module "common"
    // ==================================================================
    
    /**
     * Event được bắn ra khi booking hoàn tất thành công.
     */
    @Data
    public static class BookingCompletedEvent {
        private final String userId;
        private final String bookingId;
        private final BigDecimal spentAmount;
        private final String paymentMethod;
    }

    /**
     * Event được bắn ra khi order bị hủy.
     */
    @Data
    public static class OrderCancelledEvent {
        private final String orderId;
        private final String userId;
        private final String walletId; // Cần thiết để biết hoàn tiền vào ví nào
        private final BigDecimal amount;
        // private final UserType cancelledBy; // (VD: VENDOR, USER)
    }
}