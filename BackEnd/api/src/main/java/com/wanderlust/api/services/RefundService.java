package com.wanderlust.api.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.Refund;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.RefundStatus;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.RefundRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RefundService {

    private final RefundRepository refundRepository;
    private final BookingRepository bookingRepository;

    /**
     * User requests a refund
     */
    @Transactional
    public Refund requestRefund(String bookingId, String userId, String reason) {
        // Validate booking exists and belongs to user
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Booking does not belong to user");
        }

        // Check refund eligibility based on time windows
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = booking.getStartDate();
        LocalDateTime endDate = booking.getEndDate();

        // Window 1: Before start date
        boolean canRefundPreStart = now.isBefore(startDate);

        // Window 2: After end date but within 1 day dispute window
        boolean canRefundPostEnd = now.isAfter(endDate) &&
                now.isBefore(endDate.plusDays(1)) &&
                !Boolean.TRUE.equals(booking.getUserConfirmed());

        if (!canRefundPreStart && !canRefundPostEnd) {
            throw new RuntimeException("Refund window closed. Cannot request refund.");
        }

        // Create refund request
        Refund refund = new Refund();
        refund.setBookingId(bookingId);
        refund.setUserId(userId);
        refund.setReason(reason);
        refund.setAmount(booking.getTotalPrice());
        refund.setStatus(RefundStatus.PENDING);

        // Update booking status
        booking.setStatus(BookingStatus.REFUND_REQUESTED);
        bookingRepository.save(booking);

        return refundRepository.save(refund);
    }

    /**
     * Admin approves refund
     */
    @Transactional
    public Refund approveRefund(String refundId, String adminId, String response) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund not found: " + refundId));

        refund.setStatus(RefundStatus.APPROVED);
        refund.setAdminResponse(response);
        refund.setProcessedBy(adminId);
        refund.setProcessedAt(LocalDateTime.now());

        // Update booking status
        Booking booking = bookingRepository.findById(refund.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason("Refund approved: " + response);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancelledBy(adminId);
        bookingRepository.save(booking);

        return refundRepository.save(refund);
    }

    /**
     * Admin rejects refund
     */
    @Transactional
    public Refund rejectRefund(String refundId, String adminId, String response) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund not found: " + refundId));

        refund.setStatus(RefundStatus.REJECTED);
        refund.setAdminResponse(response);
        refund.setProcessedBy(adminId);
        refund.setProcessedAt(LocalDateTime.now());

        // Restore booking to CONFIRMED
        Booking booking = bookingRepository.findById(refund.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return refundRepository.save(refund);
    }

    public List<Refund> getRefundsByUser(String userId) {
        return refundRepository.findByUserId(userId);
    }

    public List<Refund> getPendingRefunds() {
        return refundRepository.findByStatus(RefundStatus.PENDING);
    }
}
