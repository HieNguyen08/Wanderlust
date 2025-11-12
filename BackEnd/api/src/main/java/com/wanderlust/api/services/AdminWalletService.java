package com.wanderlust.api.services;

import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.entity.types.WalletStatus;
import org.springframework.data.domain.Page;

// Đã import các DTO cần thiết
import com.wanderlust.api.dto.admin.WalletAdminDTO;
import com.wanderlust.api.dto.admin.WalletDetailAdminDTO;
import com.wanderlust.api.dto.admin.PendingRefundDTO;
import com.wanderlust.api.dto.admin.AdminRefundRequestDTO;

public interface AdminWalletService {

    /**
     * Lấy tất cả ví với phân trang và tìm kiếm
     */
    Page<WalletAdminDTO> getAllWallets(int page, int size, String search);

    /**
     * Lấy chi tiết ví user (bao gồm user info)
     */
    WalletDetailAdminDTO getUserWalletDetail(String userId);

    /**
     * Duyệt refund request
     */
    void approveRefund(String transactionId, String adminId, String notes);

    /**
     * Từ chối refund request
     */
    void rejectRefund(String transactionId, String adminId, String reason);

    /**
     * Tạo refund thủ công (admin compensation)
     */
    void createManualRefund(AdminRefundRequestDTO refundRequest, String adminId);

    /**
     * Lấy danh sách pending refunds
     */
    Page<PendingRefundDTO> getPendingRefunds(int page, int size);

    /**
     * Khóa/mở khóa ví
     */
    void updateWalletStatus(String userId, WalletStatus newStatus, String reason);

    /**
     * Xem transactions của user (với quyền admin)
     */
    Page<TransactionResponseDTO> getUserTransactionsAsAdmin(String userId, int page, int size);
}