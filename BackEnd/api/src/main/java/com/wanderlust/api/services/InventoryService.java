package com.wanderlust.api.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.CarStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service xử lý logic inventory (slot/phòng) khi booking
 * - Trừ slot khi booking được tạo (tại startDate)
 * - Restore slot khi booking complete (tại endDate + 1h)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final RoomRepository roomRepository;
    private final ActivityRepository activityRepository;
    private final CarRentalRepository carRentalRepository;

    /**
     * Giảm inventory khi booking starts
     * Được gọi từ scheduler tại startDate
     */
    @Transactional
    public void decreaseInventory(Booking booking) {
        BookingType type = booking.getBookingType();
        
        if (type == null) {
            log.warn("⚠️ Booking {} has no type, skipping inventory decrease", booking.getBookingCode());
            return;
        }

        switch (type) {
            case HOTEL:
                decreaseHotelRoom(booking);
                break;
            case ACTIVITY:
                decreaseActivitySlots(booking);
                break;
            case CAR_RENTAL:
                decreaseCarRentalSlots(booking);
                break;
            case FLIGHT:
                // Flights don't need inventory management
                log.debug("Flight booking {} - no inventory to decrease", booking.getBookingCode());
                break;
            default:
                log.warn("⚠️ Unknown booking type {} for booking {}", type, booking.getBookingCode());
        }
    }

    /**
     * Khôi phục inventory khi booking complete
     * Được gọi từ scheduler sau endDate + 1h
     */
    @Transactional
    public void restoreInventory(Booking booking) {
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

    // ========== HOTEL ==========
    
    private void decreaseHotelRoom(Booking booking) {
        if (booking.getRoomIds() == null || booking.getRoomIds().isEmpty()) {
            log.warn("⚠️ Hotel booking {} has no roomIds", booking.getBookingCode());
            return;
        }

        // Xử lý từng phòng trong danh sách
        for (String roomId : booking.getRoomIds()) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

            Integer currentAvailable = room.getAvailableRooms() != null ? room.getAvailableRooms() : 0;
            if (currentAvailable <= 0) {
                throw new RuntimeException("No available rooms for room " + room.getId());
            }

            room.setAvailableRooms(currentAvailable - 1);
            roomRepository.save(room);

            log.info("🏨 Decreased 1 room for roomId: {} (new available: {})",
                    room.getId(), room.getAvailableRooms());
        }
    }

    private void restoreHotelRoom(Booking booking) {
        if (booking.getRoomIds() == null || booking.getRoomIds().isEmpty()) {
            log.warn("⚠️ Hotel booking {} has no roomIds", booking.getBookingCode());
            return;
        }

        // Xử lý từng phòng trong danh sách
        for (String roomId : booking.getRoomIds()) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

            Integer currentAvailable = room.getAvailableRooms() != null ? room.getAvailableRooms() : 0;
            room.setAvailableRooms(currentAvailable + 1);
            roomRepository.save(room);

            log.info("🏨 Restored 1 room for roomId: {} (new available: {})",
                    room.getId(), room.getAvailableRooms());
        }
    }

    // ========== ACTIVITY ==========
    
    private void decreaseActivitySlots(Booking booking) {
        if (booking.getActivityId() == null) {
            log.warn("⚠️ Activity booking {} has no activityId", booking.getBookingCode());
            return;
        }

        Activity activity = activityRepository.findById(booking.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", booking.getActivityId()));

        // Calculate slots based on numberOfGuests
        Integer slotsToDecrease = 1;
        if (booking.getNumberOfGuests() != null && booking.getNumberOfGuests().getAdults() != null) {
            slotsToDecrease = booking.getNumberOfGuests().getAdults();
            if (booking.getNumberOfGuests().getChildren() != null) {
                slotsToDecrease += booking.getNumberOfGuests().getChildren();
            }
        }

        // Note: Activity entity không có field "availableSlots"
        // Trong production, bạn cần thêm field này hoặc quản lý qua collection khác
        log.info("🎭 Decreased {} slots for activityId: {}", slotsToDecrease, activity.getId());
    }

    private void restoreActivitySlots(Booking booking) {
        if (booking.getActivityId() == null) {
            log.warn("⚠️ Activity booking {} has no activityId", booking.getBookingCode());
            return;
        }

        Activity activity = activityRepository.findById(booking.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", booking.getActivityId()));

        Integer slotsToRestore = 1;
        if (booking.getNumberOfGuests() != null && booking.getNumberOfGuests().getAdults() != null) {
            slotsToRestore = booking.getNumberOfGuests().getAdults();
            if (booking.getNumberOfGuests().getChildren() != null) {
                slotsToRestore += booking.getNumberOfGuests().getChildren();
            }
        }

        log.info("🎭 Restored {} slots for activityId: {}", slotsToRestore, activity.getId());
    }

    // ========== CAR RENTAL ==========
    
    private void decreaseCarRentalSlots(Booking booking) {
        if (booking.getCarRentalId() == null) {
            log.warn("⚠️ Car rental booking {} has no carRentalId", booking.getBookingCode());
            return;
        }

        CarRental car = carRentalRepository.findById(booking.getCarRentalId())
                .orElseThrow(() -> new ResourceNotFoundException("CarRental", "id", booking.getCarRentalId()));

        // Set car as RENTED
        car.setStatus(CarStatus.RENTED);
        carRentalRepository.save(car);

        log.info("🚗 Set car {} to RENTED status", car.getId());
    }

    private void restoreCarRentalSlots(Booking booking) {
        if (booking.getCarRentalId() == null) {
            log.warn("⚠️ Car rental booking {} has no carRentalId", booking.getBookingCode());
            return;
        }

        CarRental car = carRentalRepository.findById(booking.getCarRentalId())
                .orElseThrow(() -> new ResourceNotFoundException("CarRental", "id", booking.getCarRentalId()));

        // Set car back to AVAILABLE
        car.setStatus(CarStatus.AVAILABLE);
        carRentalRepository.save(car);

        log.info("🚗 Set car {} back to AVAILABLE status", car.getId());
    }
}
