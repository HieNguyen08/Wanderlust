package com.wanderlust.api.controller;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.services.BookingService;
// Import 2 class principal
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.CustomOAuth2User;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO, Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        bookingDTO.setUserId(userId); 
        
        BookingDTO newBooking = (BookingDTO) bookingService.create(bookingDTO);
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