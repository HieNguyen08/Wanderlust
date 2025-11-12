package com.wanderlust.api.controller;

import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.wanderlust.api.services.AdminWalletService;

// Giả định để lấy Admin ID
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder;

// Import đầy đủ các DTOs
import com.wanderlust.api.dto.admin.WalletAdminDTO;
import com.wanderlust.api.dto.admin.WalletDetailAdminDTO;
import com.wanderlust.api.dto.admin.AdminApproveRefundDTO;
import com.wanderlust.api.dto.admin.AdminRejectRefundDTO;
import com.wanderlust.api.dto.admin.AdminRefundRequestDTO;
import com.wanderlust.api.dto.admin.PendingRefundDTO;
import com.wanderlust.api.dto.admin.WalletStatusUpdateDTO;

@RestController
@RequestMapping("/api/v1/admin/wallets")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminWalletController {

    private final AdminWalletService adminWalletService;

    /**
     * 1. LẤY DANH SÁCH TẤT CẢ VÍ
     */
    @GetMapping
    public ResponseEntity<Page<WalletAdminDTO>> getAllWallets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        Page<WalletAdminDTO> wallets = adminWalletService.getAllWallets(page, size, search);
        return ResponseEntity.ok(wallets);
    }

    /**
     * 2. LẤY CHI TIẾT VÍ CỦA USER
     */
    @GetMapping("/{userId}")
    public ResponseEntity<WalletDetailAdminDTO> getUserWallet(
            @PathVariable String userId
    ) {
        WalletDetailAdminDTO walletDetail = adminWalletService.getUserWalletDetail(userId);
        return ResponseEntity.ok(walletDetail);
    }

    /**
     * 3. DUYỆT YÊU CẦU HOÀN TIỀN
     */
    @PutMapping("/refunds/{transactionId}/approve")
    public ResponseEntity<Void> approveRefund(
            @PathVariable String transactionId,
            @RequestBody AdminApproveRefundDTO approveDTO // Sử dụng DTO
    ) {
        String adminId = getCurrentAdminId();
        String notes = approveDTO.getNotes(); // Lấy notes từ DTO
        adminWalletService.approveRefund(transactionId, adminId, notes);
        return ResponseEntity.ok().build();
    }

    /**
     * 4. TỪ CHỐI YÊU CẦU HOÀN TIỀN
     */
    @PutMapping("/refunds/{transactionId}/reject")
    public ResponseEntity<Void> rejectRefund(
            @PathVariable String transactionId,
            @RequestBody AdminRejectRefundDTO rejectDTO // Sử dụng DTO
    ) {
        String adminId = getCurrentAdminId();
        String reason = rejectDTO.getReason(); // Lấy lý do từ DTO
        adminWalletService.rejectRefund(transactionId, adminId, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 5. TẠO REFUND THỦ CÔNG
     */
    @PostMapping("/refunds")
    public ResponseEntity<Void> createManualRefund(
            @RequestBody AdminRefundRequestDTO refundRequest // Sử dụng DTO
    ) {
        String adminId = getCurrentAdminId();
        adminWalletService.createManualRefund(refundRequest, adminId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * 6. LẤY DANH SÁCH REFUND CHỜ XỬ LÝ
     */
    @GetMapping("/refunds/pending")
    public ResponseEntity<Page<PendingRefundDTO>> getPendingRefunds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<PendingRefundDTO> refunds = adminWalletService.getPendingRefunds(page, size);
        return ResponseEntity.ok(refunds);
    }

    /**
     * 7. KHÓA/MỞ KHÓA VÍ
     */
    @PutMapping("/{userId}/status")
    public ResponseEntity<Void> updateWalletStatus(
            @PathVariable String userId,
            @RequestBody WalletStatusUpdateDTO statusUpdate // Sử dụng DTO
    ) {
        adminWalletService.updateWalletStatus(userId, statusUpdate.getNewStatus(), statusUpdate.getReason());
        return ResponseEntity.ok().build();
    }

    /**
     * 8. XEM LỊCH SỬ GIAO DỊCH CỦA USER
     */
    @GetMapping("/{userId}/transactions")
    public ResponseEntity<Page<TransactionResponseDTO>> getUserTransactions(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<TransactionResponseDTO> transactions = adminWalletService.getUserTransactionsAsAdmin(userId, page, size);
        return ResponseEntity.ok(transactions);
    }

    private String getCurrentAdminId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Giả định 'name' trong Authentication Principal là ID của admin
        return authentication.getName();
    }
}