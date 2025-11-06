package com.wanderlust.api.controller;

import com.wanderlust.api.dto.TopUpRequestDTO;
import com.wanderlust.api.dto.WalletResponseDTO;
import com.wanderlust.api.services.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// TODO: Import các DTO còn thiếu khi bạn tạo chúng
import com.wanderlust.api.dto.TopUpResponseDTO;
import com.wanderlust.api.dto.PaymentCallbackDTO;
import com.wanderlust.api.dto.PaymentResponseDTO;
import com.wanderlust.api.dto.WalletPaymentRequestDTO;
import com.wanderlust.api.dto.WithdrawRequestDTO;
import com.wanderlust.api.dto.WithdrawResponseDTO;

// Giả định bạn dùng Spring Security để lấy user ID
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    /**
     * [cite_start]1. LẤY THÔNG TIN VÍ (cho Header và UserWalletPage) [cite: 1]
     */
    @GetMapping
    public ResponseEntity<WalletResponseDTO> getWallet() {
        String userId = getCurrentUserId(); // Lấy userId từ token
        WalletResponseDTO wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }

    /**
     * [cite_start]2. NẠP TIỀN VÀO VÍ (cho TopUpWalletPage) [cite: 1]
     * * TODO: Cần file DTO: TopUpResponseDTO
     */
    @PostMapping("/topup")
    public ResponseEntity<?> topUpWallet(
            @RequestBody TopUpRequestDTO topUpRequest
    ) {
        // String userId = getCurrentUserId();
        // TopUpResponseDTO response = walletService.initiateTopUp(userId, topUpRequest);
        // return ResponseEntity.ok(response);
        
        // Mã tạm thời vì DTO chưa có
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body("Tính năng chưa hoàn thiện. Cần TopUpResponseDTO.");
    }

    /**
     * [cite_start]3. XÁC NHẬN THANH TOÁN TỪ PAYMENT GATEWAY (Webhook) [cite: 13]
     * * TODO: Cần file DTO: PaymentCallbackDTO
     */
    @PostMapping("/topup/callback")
    public ResponseEntity<Void> handleTopUpCallback(
            // @RequestBody PaymentCallbackDTO callbackDTO
    ) {
        // walletService.processTopUpCallback(callbackDTO);
        // return ResponseEntity.ok().build();
        
        // Mã tạm thời vì DTO chưa có
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /**
     * [cite_start]4. THANH TOÁN BẰNG VÍ (khi user booking) [cite: 1]
     * * TODO: Cần file DTO: PaymentResponseDTO, WalletPaymentRequestDTO
     */
    @PostMapping("/pay")
    public ResponseEntity<?> payWithWallet(
            // @RequestBody WalletPaymentRequestDTO paymentRequest
    ) {
        // String userId = getCurrentUserId();
        // PaymentResponseDTO response = walletService.processWalletPayment(userId, paymentRequest);
        // return ResponseEntity.ok(response);
        
        // Mã tạm thời vì DTO chưa có
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body("Tính năng chưa hoàn thiện. Cần WalletPaymentRequestDTO và PaymentResponseDTO.");
    }

    /**
     * [cite_start]5. YÊU CẦU RÚT TIỀN (future feature) [cite: 1]
     * * TODO: Cần file DTO: WithdrawRequestDTO, WithdrawResponseDTO
     */
    @PostMapping("/withdraw")
    public ResponseEntity<?> requestWithdraw(
            // @RequestBody WithdrawRequestDTO withdrawRequest
    ) {
        // String userId = getCurrentUserId();
        // WithdrawResponseDTO response = walletService.requestWithdraw(userId, withdrawRequest);
        // return ResponseEntity.ok(response);
        
        // Mã tạm thời vì DTO chưa có
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body("Tính năng chưa hoàn thiện. Cần WithdrawRequestDTO và WithdrawResponseDTO.");
    }

    /**
     * Helper: Lấy User ID từ Spring Security Context
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }
        // Giả định 'name' trong token là userId
        return authentication.getName(); 
    }
}