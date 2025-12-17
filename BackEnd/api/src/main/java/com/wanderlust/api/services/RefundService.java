package com.wanderlust.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.dto.RefundDTO;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Refund;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.entity.types.RefundStatus;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RefundRepository;
import com.wanderlust.api.repository.RoomRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RefundService {

        private final RefundRepository refundRepository;
        private final BookingRepository bookingRepository;
        private final HotelRepository hotelRepository;
        private final RoomRepository roomRepository;
        private final ActivityRepository activityRepository;
        private final CarRentalRepository carRentalRepository;
        private final org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

        /**
         * Get all refunds with pagination and search (Admin)
         */
        public org.springframework.data.domain.Page<RefundDTO> getAllRefunds(String search, String status,
                        org.springframework.data.domain.Pageable pageable) {
                org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query()
                                .with(pageable);
                List<org.springframework.data.mongodb.core.query.Criteria> criteriaList = new java.util.ArrayList<>();

                if (org.springframework.util.StringUtils.hasText(status) && !"all".equalsIgnoreCase(status)) {
                        String s = status.toLowerCase();
                        if ("pending".equals(s)) {
                                criteriaList.add(org.springframework.data.mongodb.core.query.Criteria.where("status")
                                                .is(BookingStatus.REFUND_REQUESTED));
                                criteriaList.add(org.springframework.data.mongodb.core.query.Criteria
                                                .where("paymentStatus")
                                                .is(PaymentStatus.COMPLETED));
                        } else if ("approved".equals(s)) {
                                criteriaList.add(org.springframework.data.mongodb.core.query.Criteria.where("status")
                                                .is(BookingStatus.CANCELLED));
                                // Could also check vendorRefundApproved or adminRefundApproved if needed
                        } else if ("rejected".equals(s)) {
                                // Hard to track rejected on Booking entity alone if it reverts to CONFIRMED.
                                // For now, skip or use a marker
                        } else if ("completed".equals(s)) {
                                criteriaList.add(org.springframework.data.mongodb.core.query.Criteria.where("status")
                                                .is(BookingStatus.CANCELLED));
                                criteriaList.add(org.springframework.data.mongodb.core.query.Criteria
                                                .where("paymentStatus")
                                                .is(PaymentStatus.REFUNDED));
                        }
                } else {
                        // "All" - mostly interested in refund workflows
                        criteriaList.add(new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                                        org.springframework.data.mongodb.core.query.Criteria.where("status")
                                                        .is(BookingStatus.REFUND_REQUESTED),
                                        org.springframework.data.mongodb.core.query.Criteria.where("status")
                                                        .is(BookingStatus.CANCELLED), // Approved/Completed
                                        org.springframework.data.mongodb.core.query.Criteria.where("paymentStatus")
                                                        .is(PaymentStatus.REFUNDED)));
                }

                if (org.springframework.util.StringUtils.hasText(search)) {
                        String regex = search.trim();
                        criteriaList.add(new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                                        org.springframework.data.mongodb.core.query.Criteria.where("bookingCode")
                                                        .regex(regex, "i"),
                                        org.springframework.data.mongodb.core.query.Criteria.where("guestInfo.fullName")
                                                        .regex(regex, "i"),
                                        org.springframework.data.mongodb.core.query.Criteria.where("guestInfo.email")
                                                        .regex(regex, "i")));
                }

                if (!criteriaList.isEmpty()) {
                        query.addCriteria(new org.springframework.data.mongodb.core.query.Criteria()
                                        .andOperator(criteriaList.toArray(
                                                        new org.springframework.data.mongodb.core.query.Criteria[0])));
                }

                long total = mongoTemplate.count(
                                org.springframework.data.mongodb.core.query.Query.of(query).limit(0).skip(0),
                                Booking.class);

                query.with(pageable);
                List<Booking> bookings = mongoTemplate.find(query, Booking.class);

                // Map Booking -> RefundDTO
                List<RefundDTO> dtos = bookings.stream().map(this::bookingToRefundDTO).collect(Collectors.toList());

                return new org.springframework.data.domain.PageImpl<>(dtos, pageable, total);
        }

        private RefundDTO bookingToRefundDTO(Booking booking) {
                RefundDTO dto = new RefundDTO();
                // Use Booking ID as pseudo-Refund ID if real one doesn't exist
                dto.setId(booking.getId());
                dto.setBookingId(booking.getId());
                dto.setBookingCode(booking.getBookingCode());

                dto.setUserId(booking.getUserId());
                if (booking.getGuestInfo() != null) {
                        dto.setUserName(booking.getGuestInfo().getFullName());
                        dto.setUserEmail(booking.getGuestInfo().getEmail());
                }

                dto.setAmount(booking.getTotalPrice());
                dto.setOriginalAmount(booking.getTotalPrice());
                dto.setReason(booking.getCancellationReason());

                // Map Status
                if (booking.getStatus() == BookingStatus.REFUND_REQUESTED) {
                        dto.setStatus(RefundStatus.PENDING);
                } else if (booking.getStatus() == BookingStatus.CANCELLED) {
                        // Could be Approved or Completed
                        dto.setStatus(RefundStatus.APPROVED);
                } else {
                        dto.setStatus(RefundStatus.REJECTED); // Fallback
                }

                dto.setServiceName(resolveServiceName(booking));
                dto.setServiceType(booking.getBookingType() != null ? booking.getBookingType().name() : "UNKNOWN");
                dto.setVendorName("Vendor " + booking.getVendorId());

                if (booking.getPaymentMethod() != null) {
                        dto.setPaymentMethod(booking.getPaymentMethod().name());
                }

                dto.setProcessedBy(booking.getCancelledBy());
                dto.setProcessedAt(booking.getCancelledAt());

                dto.setCreatedAt(booking.getCreatedAt()); // Or updated at?
                dto.setUpdatedAt(booking.getUpdatedAt());

                return dto;
        }

        private String resolveServiceName(Booking booking) {
                if (booking == null) {
                        return "N/A";
                }
                BookingType type = booking.getBookingType();
                if (type == BookingType.HOTEL) {
                        if (booking.getHotelId() != null) {
                                return hotelRepository.findById(booking.getHotelId()).map(Hotel::getName)
                                                .orElse("Hotel");
                        }
                        if (booking.getRoomIds() != null && !booking.getRoomIds().isEmpty()) {
                                Optional<Room> room = roomRepository.findById(booking.getRoomIds().get(0));
                                if (room.isPresent() && room.get().getHotelId() != null) {
                                        return hotelRepository.findById(room.get().getHotelId()).map(Hotel::getName)
                                                        .orElse("Hotel");
                                }
                        }
                } else if (type == BookingType.CAR_RENTAL && booking.getCarRentalId() != null) {
                        return carRentalRepository.findById(booking.getCarRentalId())
                                        .map(c -> c.getBrand() + " " + c.getModel()).orElse("Car Rental");
                } else if (type == BookingType.ACTIVITY && booking.getActivityId() != null) {
                        return activityRepository.findById(booking.getActivityId()).map(Activity::getName)
                                        .orElse("Activity");
                } else if (type == BookingType.FLIGHT) {
                        return "Flight Booking"; // Simplified for now
                }
                return "Service";
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

        /**
         * Get refund statistics for admin dashboard
         */
        public Map<String, Object> getRefundStatistics() {
                Map<String, Object> stats = new java.util.HashMap<>();

                // Count by status
                stats.put("pendingCount", refundRepository.countByStatus(RefundStatus.PENDING));
                stats.put("approvedCount", refundRepository.countByStatus(RefundStatus.APPROVED));
                stats.put("rejectedCount", refundRepository.countByStatus(RefundStatus.REJECTED));

                // Calculate total refunded amount (only APPROVED refunds)
                org.springframework.data.mongodb.core.aggregation.Aggregation aggregation = org.springframework.data.mongodb.core.aggregation.Aggregation
                                .newAggregation(
                                                org.springframework.data.mongodb.core.aggregation.Aggregation.match(
                                                                org.springframework.data.mongodb.core.query.Criteria
                                                                                .where("status")
                                                                                .is(RefundStatus.APPROVED)),
                                                org.springframework.data.mongodb.core.aggregation.Aggregation.group()
                                                                .sum("amount").as("totalAmount"));

                org.springframework.data.mongodb.core.aggregation.AggregationResults<Map> results = mongoTemplate
                                .aggregate(aggregation, Refund.class, Map.class);

                Map<String, Object> result = results.getUniqueMappedResult();

                java.math.BigDecimal totalRefunded = java.math.BigDecimal.ZERO;
                if (result != null && result.get("totalAmount") != null) {
                        Object amountObj = result.get("totalAmount");
                        if (amountObj instanceof Number) {
                                totalRefunded = java.math.BigDecimal.valueOf(((Number) amountObj).doubleValue());
                        } else if (amountObj.toString() != null) {
                                totalRefunded = new java.math.BigDecimal(amountObj.toString());
                        }
                }

                stats.put("totalRefundedAmount", totalRefunded);

                return stats;
        }
}
