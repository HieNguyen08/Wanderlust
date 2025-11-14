package com.wanderlust.api.controller;

// Import DTOs
import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;

import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.services.TransactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * 1. LẤY LỊCH SỬ GIAO DỊCH (cho UserWalletPage)
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TransactionResponseDTO>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status
    ) {
        String userId = getCurrentUserId();
        Page<TransactionResponseDTO> transactionPage = transactionService.getUserTransactions(userId, page, size, type, status);
        return ResponseEntity.ok(transactionPage);
    }

    /**
     * [cite_start]2. LẤY CHI TIẾT MỘT GIAO DỊCH [cite: 24]
     */
    @GetMapping("/{transactionId}")
    @PreAuthorize("hasRole('ADMIN') or @webSecurity.isTransactionOwner(authentication, #transactionId)")
    public ResponseEntity<TransactionDetailDTO> getTransactionDetail(
            @PathVariable String transactionId
    ) {
        TransactionDetailDTO detail = transactionService.getTransactionDetail(transactionId);
        return ResponseEntity.ok(detail);
    }

    /**
     * 3. LẤY TỔNG QUAN GIAO DỊCH (Summary cho wallet card)
     */
    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TransactionSummaryDTO> getTransactionSummary() {
        String userId = getCurrentUserId();
        TransactionSummaryDTO summary = transactionService.getTransactionSummary(userId);
        return ResponseEntity.ok(summary);
    }

    /**
     * Helper: Lấy User ID từ Spring Security Context
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }
        return authentication.getName();
    }
}