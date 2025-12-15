package com.wanderlust.api.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.services.InventoryService;
import com.wanderlust.api.services.MoneyTransferService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduler to manage booking lifecycle automation
 * - Job 1: Restore inventory (slots/rooms) after booking endDate + 1 hour
 * - Job 2: Auto-complete bookings after endDate + 1 day if user hasn't
 * confirmed
 */
@Component
@AllArgsConstructor
@Slf4j
public class BookingScheduler {

    private final BookingRepository bookingRepository;
    private final MoneyTransferService moneyTransferService;
    private final InventoryService inventoryService;

    /**
     * JOB 0: Decrease Inventory at Start Date
     * Runs every 15 minutes
     * Find bookings where: startDate <= now AND inventory not yet decreased
     * Then decrease available rooms/slots
     */
    @Scheduled(cron = "0 */15 * * * *") // Every 15 minutes
    @Transactional
    public void decreaseInventoryJob() {
        log.info("🔄 [Scheduler] Starting inventory decrease job...");

        LocalDateTime now = LocalDateTime.now();

        // Find confirmed bookings that have started but inventory not decreased yet
        List<Booking> bookingsToProcess = bookingRepository.findAll().stream()
                .filter(b -> b.getStartDate() != null && !b.getStartDate().isAfter(now))
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .filter(b -> !Boolean.TRUE.equals(b.getUserConfirmed()) && !Boolean.TRUE.equals(b.getAutoCompleted())) // Not yet completed
                // Add a flag to track if inventory was decreased, for now we check by status
                .toList();

        log.info("📊 Found {} bookings to decrease inventory", bookingsToProcess.size());

        for (Booking booking : bookingsToProcess) {
            try {
                inventoryService.decreaseInventory(booking);
                log.info("✅ Decreased inventory for booking: {}", booking.getBookingCode());
            } catch (Exception e) {
                log.error("❌ Failed to decrease inventory for booking {}: {}",
                        booking.getBookingCode(), e.getMessage());
            }
        }

        log.info("✅ [Scheduler] Inventory decrease job completed");
    }

    /**
     * JOB 1: Restore Inventory
     * Runs every 30 minutes
     * Find bookings where: endDate + 1 hour < now AND status = COMPLETED
     * Then restore available rooms/slots for reuse
     */
    @Scheduled(cron = "0 */30 * * * *") // Every 30 minutes
    @Transactional
    public void restoreInventoryJob() {
        log.info("🔄 [Scheduler] Starting inventory restoration job...");

        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(1);

        // Find bookings that ended more than 1 hour ago and are COMPLETED
        // AND inventory has not been restored yet (we'll use a flag or check booking status)
        List<Booking> bookingsToProcess = bookingRepository.findAll().stream()
                .filter(b -> b.getEndDate() != null && b.getEndDate().isBefore(cutoffTime))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> Boolean.TRUE.equals(b.getUserConfirmed()) || Boolean.TRUE.equals(b.getAutoCompleted())) // Only restore for confirmed completions
                .toList();

        log.info("📊 Found {} bookings to restore inventory", bookingsToProcess.size());

        for (Booking booking : bookingsToProcess) {
            try {
                inventoryService.restoreInventory(booking);
                log.info("✅ Restored inventory for booking: {}", booking.getBookingCode());
            } catch (Exception e) {
                log.error("❌ Failed to restore inventory for booking {}: {}",
                        booking.getBookingCode(), e.getMessage());
            }
        }

        log.info("✅ [Scheduler] Inventory restoration job completed");
    }

    /**
     * JOB 2: Auto-Complete Bookings
     * Runs every 30 minutes (faster response than hourly)
     * Find bookings where: endDate + 24 hours < now AND status = CONFIRMED AND !userConfirmed
     * Then mark as COMPLETED with autoCompleted = true
     * 
     * Logic theo ảnh:
     * - Nếu user quên xác nhận sau 24h từ endDate → Tự động hoàn thành
     * - Sau khi hoàn thành → Chuyển tiền cho Vendor (hoặc Admin nếu dịch vụ của Admin)
     * - Commission 5% sẽ được trừ tự động trong processBookingCompletionTransfer()
     */
    @Scheduled(cron = "0 */30 * * * *") // Every 30 minutes (more responsive)
    @Transactional
    public void autoCompleteBookingsJob() {
        log.info("🔄 [Scheduler] Starting auto-completion job...");

        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24); // Exactly 24 hours from endDate

        // Find bookings to auto-complete (after 24h window expires)
        List<Booking> bookingsToComplete = bookingRepository.findAll().stream()
                .filter(b -> b.getEndDate() != null && b.getEndDate().isBefore(cutoffTime))
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED) // Only CONFIRMED, not yet COMPLETED
                .filter(b -> !Boolean.TRUE.equals(b.getUserConfirmed())) // User hasn't manually confirmed
                .filter(b -> !Boolean.TRUE.equals(b.getAutoCompleted())) // Not auto-completed yet
                .toList();

        log.info("📊 Found {} bookings to auto-complete (past 24h window)", bookingsToComplete.size());

        for (Booking booking : bookingsToComplete) {
            try {
                // Mark as completed with auto-complete flag
                booking.setStatus(BookingStatus.COMPLETED);
                booking.setAutoCompleted(true);
                booking.setUpdatedAt(LocalDateTime.now());
                bookingRepository.save(booking);

                log.info("✅ Auto-completed booking: {} (User did not confirm within 24h)", 
                        booking.getBookingCode());

                // Transfer money to Vendor/Admin after completion
                // This handles the money flow according to the image:
                // - Admin services: Money already with Admin
                // - Vendor services: Transfer (P - V - Commission) to Vendor
                try {
                    moneyTransferService.processBookingCompletionTransfer(booking.getId());
                    log.info("💰 Money transferred for booking: {} | VendorID: {} | Amount: {}", 
                            booking.getBookingCode(), 
                            booking.getVendorId() != null ? booking.getVendorId() : "ADMIN",
                            booking.getTotalPrice());
                } catch (Exception e) {
                    log.error("❌ Failed to transfer money for booking {}: {}",
                            booking.getBookingCode(), e.getMessage());
                    // Note: Booking is still marked COMPLETED even if transfer fails
                    // Manual intervention may be needed for failed transfers
                }

                // TODO: Create notification for user about auto-completion
                // notificationService.createAutoCompletionNotification(booking);

            } catch (Exception e) {
                log.error("❌ Failed to auto-complete booking {}: {}",
                        booking.getBookingCode(), e.getMessage());
            }
        }

        log.info("✅ [Scheduler] Auto-completion job completed. Processed {} bookings.", 
                bookingsToComplete.size());
    }
}
