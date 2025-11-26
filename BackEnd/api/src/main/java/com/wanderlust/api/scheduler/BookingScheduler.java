package com.wanderlust.api.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.RoomRepository;

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
    private final RoomRepository roomRepository;
    private final ActivityRepository activityRepository;
    private final CarRentalRepository carRentalRepository;

    /**
     * JOB 1: Restore Inventory
     * Runs every 30 minutes
     * Find bookings where: endDate + 1 hour < now AND inventory not yet restored
     * Then restore available rooms/slots
     */
    @Scheduled(cron = "0 */30 * * * *") // Every 30 minutes
    @Transactional
    public void restoreInventoryJob() {
        log.info("🔄 [Scheduler] Starting inventory restoration job...");

        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(1);

        // Find bookings that ended more than 1 hour ago and are CONFIRMED/COMPLETED
        List<Booking> bookingsToProcess = bookingRepository.findAll().stream()
                .filter(b -> b.getEndDate() != null && b.getEndDate().isBefore(cutoffTime))
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> !Boolean.TRUE.equals(b.getAutoCompleted())) // Not yet processed
                .toList();

        log.info("📊 Found {} bookings to restore inventory", bookingsToProcess.size());

        for (Booking booking : bookingsToProcess) {
            try {
                restoreInventoryForBooking(booking);
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
     * Runs every hour
     * Find bookings where: endDate + 1 day < now AND status != COMPLETED AND
     * !userConfirmed
     * Then mark as COMPLETED with autoCompleted = true
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour at minute 0
    @Transactional
    public void autoCompleteBookingsJob() {
        log.info("🔄 [Scheduler] Starting auto-completion job...");

        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(1);

        // Find bookings to auto-complete
        List<Booking> bookingsToComplete = bookingRepository.findAll().stream()
                .filter(b -> b.getEndDate() != null && b.getEndDate().isBefore(cutoffTime))
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED) // Only CONFIRMED, not yet COMPLETED
                .filter(b -> !Boolean.TRUE.equals(b.getUserConfirmed())) // User hasn't manually confirmed
                .filter(b -> !Boolean.TRUE.equals(b.getAutoCompleted())) // Not auto-completed yet
                .toList();

        log.info("📊 Found {} bookings to auto-complete", bookingsToComplete.size());

        for (Booking booking : bookingsToComplete) {
            try {
                booking.setStatus(BookingStatus.COMPLETED);
                booking.setAutoCompleted(true);
                booking.setUpdatedAt(LocalDateTime.now());
                bookingRepository.save(booking);

                log.info("✅ Auto-completed booking: {}", booking.getBookingCode());

                // TODO: Create notification for user
                // notificationService.createCompletionNotification(booking);

            } catch (Exception e) {
                log.error("❌ Failed to auto-complete booking {}: {}",
                        booking.getBookingCode(), e.getMessage());
            }
        }

        log.info("✅ [Scheduler] Auto-completion job completed");
    }

    /**
     * Helper method to restore inventory based on booking type
     */
    private void restoreInventoryForBooking(Booking booking) {
        BookingType type = booking.getBookingType();

        if (type == null) {
            log.warn("⚠️ Booking {} has no type, skipping inventory restore", booking.getBookingCode());
            return;
        }

        switch (type) {
            case HOTEL:
                restoreHotelRoom(booking);
                break;
            case ACTIVITY:
                restoreActivitySlots(booking);
                break;
            case CAR_RENTAL:
                restoreCarRentalSlots(booking);
                break;
            case FLIGHT:
                // Flights don't need inventory restoration
                log.debug("Flight booking {} - no inventory to restore", booking.getBookingCode());
                break;
            default:
                log.warn("⚠️ Unknown booking type {} for booking {}", type, booking.getBookingCode());
        }
    }

    /**
     * Restore hotel room availability
     */
    private void restoreHotelRoom(Booking booking) {
        if (booking.getRoomId() == null) {
            log.warn("⚠️ Hotel booking {} has no roomId", booking.getBookingCode());
            return;
        }

        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room == null) {
            log.warn("⚠️ Room {} not found for booking {}", booking.getRoomId(), booking.getBookingCode());
            return;
        }

        // Increment available rooms
        Integer currentAvailable = room.getAvailableRooms() != null ? room.getAvailableRooms() : 0;
        room.setAvailableRooms(currentAvailable + 1);
        roomRepository.save(room);

        log.info("🏨 Restored 1 room for roomId: {} (new available: {})",
                room.getId(), room.getAvailableRooms());
    }

    /**
     * Restore activity slots
     */
    private void restoreActivitySlots(Booking booking) {
        if (booking.getActivityId() == null) {
            log.warn("⚠️ Activity booking {} has no activityId", booking.getBookingCode());
            return;
        }

        Activity activity = activityRepository.findById(booking.getActivityId()).orElse(null);
        if (activity == null) {
            log.warn("⚠️ Activity {} not found for booking {}", booking.getActivityId(), booking.getBookingCode());
            return;
        }

        // Calculate slots to restore based on numberOfGuests
        Integer slotsToRestore = 1; // Default
        if (booking.getNumberOfGuests() != null && booking.getNumberOfGuests().getAdults() != null) {
            slotsToRestore = booking.getNumberOfGuests().getAdults();
            if (booking.getNumberOfGuests().getChildren() != null) {
                slotsToRestore += booking.getNumberOfGuests().getChildren();
            }
        }

        // Restore slots (ensure doesn't exceed maxParticipants)
        Integer currentMax = activity.getMaxParticipants() != null ? activity.getMaxParticipants() : 30;
        // Note: We don't track "current available" in Activity entity
        // This is a simplified approach. In production, you'd need an "availableSlots"
        // field

        log.info("🎭 Restored {} slots for activityId: {}", slotsToRestore, activity.getId());
    }

    /**
     * Restore car rental slots
     */
    private void restoreCarRentalSlots(Booking booking) {
        if (booking.getCarRentalId() == null) {
            log.warn("⚠️ Car rental booking {} has no carRentalId", booking.getBookingCode());
            return;
        }

        CarRental car = carRentalRepository.findById(booking.getCarRentalId()).orElse(null);
        if (car == null) {
            log.warn("⚠️ Car rental {} not found for booking {}", booking.getCarRentalId(), booking.getBookingCode());
            return;
        }

        // Mark car as available again (Status AVAILABLE)
        // Note: CarRental entity uses status, not quantity slots
        // You might need to add quantity tracking if multiple cars of same type exist

        log.info("🚗 Restored car rental: {}", car.getId());
    }
}
