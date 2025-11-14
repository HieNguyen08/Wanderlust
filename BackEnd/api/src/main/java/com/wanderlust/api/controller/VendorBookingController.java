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
@RequestMapping("/api/vendor/bookings")
@PreAuthorize("hasRole('PARTNER')") 
public class VendorBookingController {

    private final BookingService bookingService;

    // Helper để lấy UserID từ Authentication
    private String getVendorIdFromAuthentication(Authentication authentication) {
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
    public ResponseEntity<List<BookingDTO>> getVendorBookings(Authentication authentication) {
        String vendorId = getVendorIdFromAuthentication(authentication);
        return new ResponseEntity<>(bookingService.findByVendorId(vendorId), HttpStatus.OK);
    }


    @PostMapping("/{id}/confirm")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<BookingDTO> confirmBooking(@PathVariable String id) {
        BookingDTO result = bookingService.confirmBooking(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/{id}/reject")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<BookingDTO> rejectBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload) {
        
        String reason = payload != null ? payload.get("reason") : "Vendor rejected";
        BookingDTO result = bookingService.rejectBooking(id, reason);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}