package com.wanderlust.api.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.services.BookingService;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;

import lombok.AllArgsConstructor;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/bookings")
@PreAuthorize("isAuthenticated()")
public class BookingController {

    private final BookingService bookingService;

    // DateTimeFormatter to handle multiple date formats

    private static final DateTimeFormatter[] DATE_FORMATTERS = {
            DateTimeFormatter.ISO_LOCAL_DATE_TIME, // 2025-12-16T12:00:00
            DateTimeFormatter.ISO_OFFSET_DATE_TIME, // 2025-12-16T12:00:00+07:00
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"), // 23/11/2025 -> atStartOfDay
            DateTimeFormatter.ofPattern("yyyy-MM-dd"), // 2025-11-23 -> atStartOfDay
            DateTimeFormatter.ISO_LOCAL_DATE, // ISO date -> atStartOfDay
            DateTimeFormatter.ofPattern("MM/dd/yyyy") // 11/23/2025 -> atStartOfDay
    };

    // Helper method to parse date/time with multiple formats
    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        String trimmed = dateStr.trim();

        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                if (formatter == DateTimeFormatter.ISO_LOCAL_DATE ||
                    formatter.equals(DateTimeFormatter.ofPattern("dd/MM/yyyy")) ||
                    formatter.equals(DateTimeFormatter.ofPattern("yyyy-MM-dd")) ||
                    formatter.equals(DateTimeFormatter.ofPattern("MM/dd/yyyy"))) {
                    return LocalDateTime.of(LocalDate.parse(trimmed, formatter), LocalTime.MIDNIGHT);
                }
                return LocalDateTime.parse(trimmed, formatter);
            } catch (DateTimeParseException e) {
                // try next
            }
        }

        System.err.println("Warning: Unable to parse date/time: '" + dateStr
                + "'. Returning null.");
        return null;
    }

    // Helper method to parse date with multiple formats
    private LocalDate parseDate(String dateStr) {
        // Return null for null, empty, or whitespace-only strings
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        // Trim the string
        dateStr = dateStr.trim();

        // If it contains 'T', extract just the date part (ISO DateTime format)
        if (dateStr.contains("T")) {
            dateStr = dateStr.substring(0, dateStr.indexOf("T"));
        }

        // Try each formatter
        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Continue to next formatter
            }
        }

        // If all formatters fail, log warning and return null instead of throwing
        // exception
        System.err.println("Warning: Unable to parse date: '" + dateStr
                + "'. Supported formats: dd/MM/yyyy, yyyy-MM-dd, MM/dd/yyyy. Returning null.");
        return null;
    }

    // Helper để lấy UserID từ Authentication
    private String getUserIdFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userId;

        if (principal instanceof CustomUserDetails) {
            userId = ((CustomUserDetails) principal).getUserID();
        } else if (principal instanceof CustomOAuth2User) {
            userId = ((CustomOAuth2User) principal).getUser().getUserId();
        } else {
            throw new IllegalStateException("Invalid principal type. Expected CustomUserDetails or CustomOAuth2User.");
        }

        if (userId == null) {
            throw new SecurityException("User ID is null in principal.");
        }
        return userId;
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        return new ResponseEntity<>(bookingService.findByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id) or hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable String id) {
        return new ResponseEntity<>(bookingService.findById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody Map<String, Object> payload,
            Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);

        // Parse payload từ frontend
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setUserId(userId);

        // Map productType -> bookingType
        String productType = (String) payload.get("productType");
        if (productType != null) {
            bookingDTO.setBookingType(BookingType.valueOf(productType));
        }

        // Map productId / flightId
        String productId = (String) payload.get("productId");
        Object flightIdObj = payload.get("flightId");

        if (productType != null) {
            switch (productType) {
                case "FLIGHT":
                    // Accept both List<String> and single String
                    if (flightIdObj instanceof List<?>) {
                        @SuppressWarnings("unchecked")
                        List<String> flightIds = (List<String>) flightIdObj;
                        bookingDTO.setFlightId(flightIds);
                    } else if (flightIdObj instanceof String) {
                        bookingDTO.setFlightId(List.of((String) flightIdObj));
                    } else if (productId != null) {
                        bookingDTO.setFlightId(List.of(productId));
                    }
                    break;
                case "HOTEL":
                    bookingDTO.setHotelId(productId);
                    break;
                case "CAR_RENTAL":
                    bookingDTO.setCarRentalId(productId);
                    break;
                case "ACTIVITY":
                    bookingDTO.setActivityId(productId);
                    break;
            }
        }

        // Parse seats
        @SuppressWarnings("unchecked")
        List<String> flightSeatIds = (List<String>) payload.get("flightSeatIds");
        if (flightSeatIds != null) {
            bookingDTO.setFlightSeatIds(flightSeatIds);
            bookingDTO.setSeatCount(flightSeatIds.size());
        }

        // Parse dates (LocalDateTime)
        String startDateStr = (String) payload.get("startDate");
        if (startDateStr != null) {
            bookingDTO.setStartDate(parseDateTime(startDateStr));
        }

        String endDateStr = (String) payload.get("endDate");
        if (endDateStr != null) {
            bookingDTO.setEndDate(parseDateTime(endDateStr));
        }

        // Parse guestInfo
        @SuppressWarnings("unchecked")
        Map<String, String> guestInfo = (Map<String, String>) payload.get("guestInfo");
        if (guestInfo != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> guestInfoObj = (Map<String, Object>) (Map<?, ?>) guestInfo;
            bookingDTO.setGuestInfo(guestInfoObj);
        }

        // Parse numberOfGuests
        @SuppressWarnings("unchecked")
        Map<String, Integer> numberOfGuests = (Map<String, Integer>) payload.get("numberOfGuests");
        if (numberOfGuests != null) {
            bookingDTO.setNumberOfGuests(numberOfGuests);
        }

        // Parse quantity
        Object quantityObj = payload.get("quantity");
        if (quantityObj != null) {
            Integer quantity = null;
            if (quantityObj instanceof Integer) {
                quantity = (Integer) quantityObj;
            } else if (quantityObj instanceof String) {
                try {
                    quantity = Integer.parseInt((String) quantityObj);
                } catch (NumberFormatException e) {
                    // Ignore invalid quantity
                }
            }
            // Store quantity in numberOfGuests or metadata as needed
            // For now, we can add it to metadata
            if (quantity != null && quantity > 0) {
                // This can be mapped to numberOfGuests or stored in metadata
                // depending on your business logic
            }
        }

        // Parse pricing fields
        bookingDTO.setBasePrice(readBigDecimal(payload.get("basePrice")));
        bookingDTO.setTaxes(readBigDecimal(payload.get("taxes")));
        bookingDTO.setFees(readBigDecimal(payload.get("fees")));
        bookingDTO.setDiscount(readBigDecimal(payload.get("discount")));
        BigDecimal totalPrice = readBigDecimal(payload.get("totalPrice"));
        if (totalPrice == null) {
            totalPrice = readBigDecimal(payload.get("amount"));
        }
        bookingDTO.setTotalPrice(totalPrice);
        bookingDTO.setCurrency((String) payload.getOrDefault("currency", "VND"));

        // Voucher
        bookingDTO.setVoucherCode((String) payload.get("voucherCode"));
        bookingDTO.setVoucherDiscount(readBigDecimal(payload.get("voucherDiscount")));

        // Metadata
        @SuppressWarnings("unchecked")
        Map<String, Object> metadata = (Map<String, Object>) payload.get("metadata");
        if (metadata != null) {
            bookingDTO.setMetadata(metadata);
        }

        // Parse specialRequests
        String specialRequests = (String) payload.get("specialRequests");
        if (specialRequests != null) {
            bookingDTO.setSpecialRequests(specialRequests);
        }

        // Set default values
        bookingDTO.setStatus(BookingStatus.PENDING);
        bookingDTO.setPaymentStatus(com.wanderlust.api.entity.types.PaymentStatus.PENDING);
        bookingDTO.setCurrency("VND");

        BookingDTO newBooking = bookingService.create(bookingDTO);
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    private BigDecimal readBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException ignored) { }
        }
        return null;
    }

    /**
     * Update booking (for payment status updates, admin updates, etc.)
     * Frontend calls this after payment completion/failure
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isBookingOwner(authentication, #id)")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates,
            Authentication authentication) {
        
        BookingDTO existingBooking = bookingService.findById(id);
        
        // Update paymentStatus if provided
        if (updates.containsKey("paymentStatus")) {
            String paymentStatusStr = (String) updates.get("paymentStatus");
            existingBooking.setPaymentStatus(
                com.wanderlust.api.entity.types.PaymentStatus.valueOf(paymentStatusStr)
            );
        }
        
        // Update paymentMethod if provided
        if (updates.containsKey("paymentMethod")) {
            String paymentMethodStr = (String) updates.get("paymentMethod");
            existingBooking.setPaymentMethod(
                com.wanderlust.api.entity.types.PaymentMethod.valueOf(paymentMethodStr)
            );
        }
        
        // Update status if provided
        if (updates.containsKey("status")) {
            String statusStr = (String) updates.get("status");
            existingBooking.setStatus(BookingStatus.valueOf(statusStr));
        }
        
        // Update specialRequests if provided
        if (updates.containsKey("specialRequests")) {
            existingBooking.setSpecialRequests((String) updates.get("specialRequests"));
        }
        
        BookingDTO updatedBooking = bookingService.update(id, existingBooking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isBookingOwner(authentication, #id)")
    public ResponseEntity<BookingDTO> cancelBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload,
            Authentication authentication) {

        String reason = payload != null ? payload.get("reason") : "User requested cancellation";
        String currentUserId = getUserIdFromAuthentication(authentication);

        BookingDTO cancelledBooking = (BookingDTO) bookingService.cancelBooking(id, reason, currentUserId);
        return new ResponseEntity<>(cancelledBooking, HttpStatus.OK);
    }

    @PostMapping("/{id}/request-refund")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id)")
    public ResponseEntity<BookingDTO> requestRefund(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = payload != null ? payload.get("reason") : "User requested refund";
        BookingDTO result = bookingService.requestRefund(id, reason);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Admin or Vendor approve refund request
     */
    @PostMapping("/{id}/approve-refund")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<BookingDTO> approveRefund(
            @PathVariable String id,
            Authentication authentication) {
        String approvedBy = getUserIdFromAuthentication(authentication);
        
        // Check if approver is vendor (by checking if user owns the booking's vendor)
        // For now, we'll determine based on role
        boolean isVendorApproval = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_VENDOR"));
        
        BookingDTO result = bookingService.approveRefund(id, approvedBy, isVendorApproval);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Admin or Vendor reject refund request
     */
    @PostMapping("/{id}/reject-refund")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<BookingDTO> rejectRefund(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload,
            Authentication authentication) {
        String rejectedBy = getUserIdFromAuthentication(authentication);
        String reason = payload != null ? payload.get("reason") : "No reason provided";
        
        BookingDTO result = bookingService.rejectRefund(id, rejectedBy, reason);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * User confirms booking completion
     * Can only be called after booking endDate
     */
    @PostMapping("/{id}/complete")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id)")
    public ResponseEntity<BookingDTO> completeBooking(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        BookingDTO result = bookingService.completeBooking(id, userId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/preview")
    public ResponseEntity<BookingDTO> previewBooking(@RequestBody BookingDTO bookingDTO) {
        BookingDTO preview = bookingService.preview(bookingDTO);
        return new ResponseEntity<>(preview, HttpStatus.OK);
    }
}