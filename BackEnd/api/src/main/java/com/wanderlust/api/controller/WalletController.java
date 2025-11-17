package com.wanderlust.api.controller;

// Import đầy đủ các DTO từ package walletDTO
import com.wanderlust.api.dto.walletDTO.TopUpRequestDTO;
import com.wanderlust.api.dto.walletDTO.WalletResponseDTO;
import com.wanderlust.api.dto.walletDTO.TopUpResponseDTO;
import com.wanderlust.api.dto.walletDTO.PaymentCallbackDTO;
import com.wanderlust.api.dto.walletDTO.PaymentResponseDTO;
import com.wanderlust.api.dto.walletDTO.WalletPaymentRequestDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawRequestDTO;
import com.wanderlust.api.dto.walletDTO.WithdrawResponseDTO;

import com.wanderlust.api.services.WalletService;
// Import 2 class principal
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.CustomOAuth2User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class WalletController {

    private final WalletService walletService;

    /**
     * 1. LẤY THÔNG TIN VÍ
     */
    @GetMapping
    public ResponseEntity<WalletResponseDTO> getWallet() {
        String userId = getCurrentUserId();
        WalletResponseDTO wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }

    /**
     * 2. NẠP TIỀN VÀO VÍ
     */
    @PostMapping("/deposit")
    public ResponseEntity<TopUpResponseDTO> topUpWallet(
            @Valid @RequestBody TopUpRequestDTO topUpRequest
    ) {
        String userId = getCurrentUserId();
        TopUpResponseDTO response = walletService.initiateTopUp(userId, topUpRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * 3. XÁC NHẬN THANH TOÁN TỪ PAYMENT GATEWAY (Webhook)
     * (Giữ nguyên /topup/callback vì đây là webhook kỹ thuật)
     */
    @PostMapping("/topup/callback")
    public ResponseEntity<Void> handleTopUpCallback(
            @RequestBody PaymentCallbackDTO callbackDTO
    ) {
        walletService.processTopUpCallback(callbackDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * 4. THANH TOÁN BẰNG VÍ
     */
    @PostMapping("/pay")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDTO> payWithWallet(
            @Valid @RequestBody WalletPaymentRequestDTO paymentRequest
    ) {
        String userId = getCurrentUserId();
        PaymentResponseDTO response = walletService.processWalletPayment(userId, paymentRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * 5. YÊU CẦU RÚT TIỀN
     */
    @PostMapping("/withdraw")
    public ResponseEntity<WithdrawResponseDTO> requestWithdraw(
            @Valid @RequestBody WithdrawRequestDTO withdrawRequest
    ) {
        String userId = getCurrentUserId();
        WithdrawResponseDTO response = walletService.requestWithdraw(userId, withdrawRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Helper: Lấy User ID từ Spring Security Context
     * === ĐÃ SỬA LỖI ===
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }
        
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
}