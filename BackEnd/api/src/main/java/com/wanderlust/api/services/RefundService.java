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
    private final org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    /**
     * Get all refunds with pagination and search (Admin)
     */
    public org.springframework.data.domain.Page<Refund> getAllRefunds(String search, String status,
            org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query()
                .with(pageable);
        List<org.springframework.data.mongodb.core.query.Criteria> criteriaList = new java.util.ArrayList<>();

        // 1. Filter by Status
        if (org.springframework.util.StringUtils.hasText(status) && !"all".equalsIgnoreCase(status)) {
            criteriaList
                    .add(org.springframework.data.mongodb.core.query.Criteria.where("status").is(status.toUpperCase()));
        }

        // 2. Filter by Search (Booking Code from Booking collection, or User Name/Email
        // if possible to join,
        // but for simplicity and performance without complex lookups, we might just
        // search Booking Code if we store it in Refund or join properly)
        // Since Refund has bookingId, we can look up Booking.
        // However, standard join in Mongo is Lookup.

        // Let's use simple find for now if search is empty, or complex lookup if search
        // is present?
        // Actually, to filter by Booking Code, we MUST join or query separate.

        // Alternative: If search is present, find matching Bookings first, then find
        // Refunds for those bookings.
        // This is often faster/simpler in code than writing a complex aggregation
        // pipeline if not strictly required.

        if (org.springframework.util.StringUtils.hasText(search)) {
            String regex = search.trim();
            // Find bookings matching the code
            List<Booking> matchedBookings = mongoTemplate.find(
                    org.springframework.data.mongodb.core.query.Query.query(
                            new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                                    org.springframework.data.mongodb.core.query.Criteria.where("bookingCode")
                                            .regex(regex, "i"),
                                    org.springframework.data.mongodb.core.query.Criteria.where("guestInfo.fullName")
                                            .regex(regex, "i"),
                                    org.springframework.data.mongodb.core.query.Criteria.where("guestInfo.email")
                                            .regex(regex, "i"))),
                    Booking.class);

            List<String> bookingIds = matchedBookings.stream().map(Booking::getId).toList();

            // Allow searching by Refund ID as well
            criteriaList.add(new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                    org.springframework.data.mongodb.core.query.Criteria.where("bookingId").in(bookingIds),
                    org.springframework.data.mongodb.core.query.Criteria.where("id").regex(regex, "i")));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new org.springframework.data.mongodb.core.query.Criteria()
                    .andOperator(criteriaList.toArray(new org.springframework.data.mongodb.core.query.Criteria[0])));
        }

        long total = mongoTemplate.count(org.springframework.data.mongodb.core.query.Query.of(query).limit(0).skip(0),
                Refund.class);
        List<Refund> refunds = mongoTemplate.find(query, Refund.class);

        return new org.springframework.data.domain.PageImpl<>(refunds, pageable, total);
    }

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
