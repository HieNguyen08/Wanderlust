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

import com.wanderlust.api.entity.Refund;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.RefundService;

import lombok.AllArgsConstructor;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/refunds")
@PreAuthorize("isAuthenticated()")
public class RefundController {

    private final RefundService refundService;

    private String getUserIdFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userId;

        if (principal instanceof CustomUserDetails) {
            userId = ((CustomUserDetails) principal).getUserID();
        } else if (principal instanceof CustomOAuth2User) {
            userId = ((CustomOAuth2User) principal).getUser().getUserId();
        } else {
            throw new IllegalStateException("Invalid principal type.");
        }

        if (userId == null) {
            throw new SecurityException("User ID is null in principal.");
        }
        return userId;
    }

    /**
     * User requests a refund for their booking
     */
    @PostMapping("/request")
    public ResponseEntity<Refund> requestRefund(
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        String bookingId = payload.get("bookingId");
        String reason = payload.get("reason");

        Refund refund = refundService.requestRefund(bookingId, userId, reason);
        return new ResponseEntity<>(refund, HttpStatus.CREATED);
    }

    /**
     * Get user's refund requests
     */
    @GetMapping("/my-refunds")
    public ResponseEntity<List<Refund>> getMyRefunds(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(refundService.getRefundsByUser(userId));
    }

    /**
     * Admin: Get all pending refund requests
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Refund>> getPendingRefunds() {
        return ResponseEntity.ok(refundService.getPendingRefunds());
    }

    /**
     * Admin: Approve a refund
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Refund> approveRefund(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String adminId = getUserIdFromAuthentication(authentication);
        String response = payload.getOrDefault("response", "Refund approved");

        Refund refund = refundService.approveRefund(id, adminId, response);
        return ResponseEntity.ok(refund);
    }

    /**
     * Admin: Reject a refund
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Refund> rejectRefund(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String adminId = getUserIdFromAuthentication(authentication);
        String response = payload.getOrDefault("response", "Refund rejected");

        Refund refund = refundService.rejectRefund(id, adminId, response);
        return ResponseEntity.ok(refund);
    }
}
