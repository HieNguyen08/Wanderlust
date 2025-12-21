package com.wanderlust.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.services.BookingService;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;

import lombok.AllArgsConstructor;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/vendor/refunds")
@PreAuthorize("hasRole('VENDOR')")
public class VendorRefundController {

    private final BookingService bookingService;

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
    public ResponseEntity<List<BookingDTO>> getVendorRefunds(Authentication authentication) {
        String vendorId = getVendorIdFromAuthentication(authentication);
        return new ResponseEntity<>(bookingService.findVendorRefundRequests(vendorId), HttpStatus.OK);
    }

    @PatchMapping("/{id}/approval")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<BookingDTO> updateVendorRefundApproval(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        String vendorId = getVendorIdFromAuthentication(authentication);
        boolean approved = payload != null && Boolean.TRUE.equals(payload.get("approved"));
        BookingDTO updated = bookingService.updateVendorRefundApproval(id, vendorId, approved);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
