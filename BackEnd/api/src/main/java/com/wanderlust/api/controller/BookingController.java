package com.wanderlust.api.controller;

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
        String userId = getUserIdFromAuthentication(authentication); // ĐÃ SỬA
        return new ResponseEntity<>(bookingService.findByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id) or hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable String id) {
        return new ResponseEntity<>(bookingService.findById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody Map<String, Object> payload, Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        
        // Parse payload từ frontend
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setUserId(userId);
        
        // Map productType -> bookingType
        String productType = (String) payload.get("productType");
        if (productType != null) {
            bookingDTO.setBookingType(BookingType.valueOf(productType));
        }
        
        // Map productId -> specific ID field
        String productId = (String) payload.get("productId");
        if (productType != null && productId != null) {
            switch (productType) {
                case "FLIGHT":
                    bookingDTO.setFlightId(productId);
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
        
        // Parse dates
        String startDateStr = (String) payload.get("startDate");
        if (startDateStr != null) {
            bookingDTO.setStartDate(java.time.LocalDate.parse(startDateStr.substring(0, 10)));
        }
        
        String endDateStr = (String) payload.get("endDate");
        if (endDateStr != null) {
            bookingDTO.setEndDate(java.time.LocalDate.parse(endDateStr.substring(0, 10)));
        }
        
        // Parse guestInfo
        @SuppressWarnings("unchecked")
        Map<String, String> guestInfo = (Map<String, String>) payload.get("guestInfo");
        if (guestInfo != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> guestInfoObj = (Map<String, Object>) (Map<?, ?>) guestInfo;
            bookingDTO.setGuestInfo(guestInfoObj);
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
    public ResponseEntity<BookingDTO> requestRefund(@PathVariable String id) {
        BookingDTO result = bookingService.requestRefund(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/preview")
    public ResponseEntity<BookingDTO> previewBooking(@RequestBody BookingDTO bookingDTO) {
        BookingDTO preview = bookingService.preview(bookingDTO);
        return new ResponseEntity<>(preview, HttpStatus.OK);
    }
}