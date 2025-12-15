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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.VendorBookingResponse;
import com.wanderlust.api.services.BookingService;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;

import lombok.AllArgsConstructor;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/vendor/bookings")
@PreAuthorize("hasRole('VENDOR')") 
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
    public ResponseEntity<List<VendorBookingResponse>> getVendorBookings(Authentication authentication) {
        String vendorId = getVendorIdFromAuthentication(authentication);
        return new ResponseEntity<>(bookingService.findVendorBookingsView(vendorId), HttpStatus.OK);
    }


    @PostMapping("/{id}/confirm")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<VendorBookingResponse> confirmBooking(@PathVariable String id) {
        bookingService.confirmBooking(id);
        return new ResponseEntity<>(bookingService.getVendorBookingView(id), HttpStatus.OK);
    }


    @PostMapping("/{id}/reject")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<VendorBookingResponse> rejectBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload) {
        
        String reason = payload != null ? payload.get("reason") : "Vendor rejected";
        bookingService.rejectBooking(id, reason);
        return new ResponseEntity<>(bookingService.getVendorBookingView(id), HttpStatus.OK);
    }
}