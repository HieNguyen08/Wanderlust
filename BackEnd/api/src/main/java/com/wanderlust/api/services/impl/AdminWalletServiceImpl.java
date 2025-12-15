package com.wanderlust.api.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional; // Cần cho logic search
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wanderlust.api.dto.admin.AdminRefundRequestDTO;
import com.wanderlust.api.dto.admin.PendingRefundDTO;
import com.wanderlust.api.dto.admin.WalletAdminDTO;
import com.wanderlust.api.dto.admin.WalletDetailAdminDTO;
import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO; // Import DTO tóm tắt
import com.wanderlust.api.entity.User; // Đã import User Entity
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.entity.types.WalletStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.repository.UserRepository; // Đã import User Repository
import com.wanderlust.api.repository.WalletRepository;
import com.wanderlust.api.repository.WalletTransactionRepository;
import com.wanderlust.api.services.AdminWalletService;
import com.wanderlust.api.services.MoneyTransferService;
import com.wanderlust.api.services.TransactionService;
import com.wanderlust.api.services.WalletService;


@Service
public class AdminWalletServiceImpl implements AdminWalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final WalletService walletService;
    private final ModelMapper modelMapper;
    private final MoneyTransferService moneyTransferService;

    // Đã inject UserRepository
    private final UserRepository userRepository;

    public AdminWalletServiceImpl(
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository,
            TransactionService transactionService,
            @Lazy WalletService walletService,
            ModelMapper modelMapper,
            UserRepository userRepository,
            MoneyTransferService moneyTransferService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.transactionService = transactionService;
        this.walletService = walletService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.moneyTransferService = moneyTransferService;
    } 

    @Override
    @Transactional
    public void approveRefund(String transactionId, String adminId, String notes) {
        
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new IllegalStateException("Transaction is not in PENDING state");
        }
        
        if (transaction.getType() != TransactionType.REFUND) {
             throw new IllegalStateException("Transaction type is not REFUND");
        }

        // 1. Cập nhật trạng thái giao dịch
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());
        transaction.setAdminNotes(notes);
        transaction.setProcessedBy(adminId);
        transactionRepository.save(transaction);

        // 2. Chuyển tiền: trừ ví admin, cộng ví user (nếu có bookingId)
        if (transaction.getBookingId() != null) {
            moneyTransferService.processRefund(transaction.getBookingId(), adminId, false);
        } else {
            // Fallback: nếu không gắn booking, chỉ cộng ví user như cũ
            walletService.updateBalance(transaction.getWalletId(), transaction.getAmount(), transaction.getType());
        }
    }

    @Override
    @Transactional
    public void rejectRefund(String transactionId, String adminId, String reason) {
        
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new IllegalStateException("Transaction is not in PENDING state");
        }
        
        if (transaction.getType() != TransactionType.REFUND) {
             throw new IllegalStateException("Transaction type is not REFUND");
        }

        // Cập nhật trạng thái FAILED và lưu lý do
        transaction.setStatus(TransactionStatus.FAILED);
        transaction.setFailedAt(LocalDateTime.now());
        transaction.setAdminNotes(reason); // Dùng adminNotes để lưu lý do từ chối
        transaction.setProcessedBy(adminId);
        transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void updateWalletStatus(String userId, WalletStatus newStatus, String reason) {
        
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        wallet.setStatus(newStatus);
        wallet.setUpdatedAt(LocalDateTime.now());
        // [GHI CHÚ] Lý do (reason) không được lưu vì trường này không tồn tại trong Wallet Entity.
        walletRepository.save(wallet);
    }

    @Override
    public Page<TransactionResponseDTO> getUserTransactionsAsAdmin(String userId, int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<WalletTransaction> transactionPage = transactionRepository.findByUserId(userId, pageable);

        List<TransactionResponseDTO> dtoList = transactionPage.getContent().stream()
                .map(tx -> modelMapper.map(tx, TransactionResponseDTO.class))
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, transactionPage.getTotalElements());
    }

    // ==================================================================
    // CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN
    // ==================================================================

    @Override
    public Page<WalletAdminDTO> getAllWallets(int page, int size, String search) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Wallet> walletPage;
        if (search != null && !search.isEmpty()) {
            // Triển khai search đơn giản: Coi 'search' là User ID
            // Để search theo email/tên, cần bổ sung phương thức trong UserRepository
            Optional<Wallet> walletOpt = walletRepository.findByUserId(search);
            List<Wallet> wallets = walletOpt.map(List::of).orElse(Collections.emptyList());
            walletPage = new PageImpl<>(wallets, pageable, wallets.size());
            walletPage = new PageImpl<>(wallets, pageable, wallets.size());
        } else {
            // Nếu không search, lấy tất cả
            walletPage = walletRepository.findAll(pageable);
        }

        // Lấy danh sách userIds từ trang ví
        List<String> userIds = walletPage.getContent().stream()
                .map(wallet -> wallet.getUserId())
                .collect(Collectors.toList());

        // Lấy thông tin Users tương ứng
        Map<String, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getUserId, user -> user)); // Dùng getUserId làm key

        List<WalletAdminDTO> dtoList = walletPage.getContent().stream()
                .map(wallet -> {
                    WalletAdminDTO dto = new WalletAdminDTO();
                    dto.setWalletId(wallet.getWalletId());
                    dto.setUserId(wallet.getUserId());
                    dto.setBalance(wallet.getBalance());
                    dto.setStatus(wallet.getStatus());

                    // Lấy thông tin user từ Map
                    User user = userMap.get(wallet.getUserId());
                    if (user != null) {
                       dto.setUserEmail(user.getEmail()); //
                       // Ghép firstName và lastName
                       dto.setUserName(String.join(" ", user.getFirstName(), user.getLastName())); 
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, walletPage.getTotalElements());
    }
    

    @Override
    public WalletDetailAdminDTO getUserWalletDetail(String userId) {
        
        // 1. Lấy thông tin user
        User user = userRepository.findByUserId(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // 2. Lấy thông tin ví
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        // 3. Lấy tóm tắt giao dịch
        TransactionSummaryDTO summary = transactionService.getTransactionSummary(userId);
        
        // 4. Gộp lại
        WalletDetailAdminDTO detailDTO = new WalletDetailAdminDTO();
        
        // User Info
        detailDTO.setUserId(user.getUserId()); //
        detailDTO.setUserEmail(user.getEmail()); //
        detailDTO.setUserFullName(String.join(" ", user.getFirstName(), user.getLastName())); //
        detailDTO.setUserPhone(user.getMobile()); //

        // Wallet Info
        detailDTO.setWalletId(wallet.getWalletId());
        detailDTO.setBalance(wallet.getBalance());
        detailDTO.setCurrency(wallet.getCurrency());
        detailDTO.setStatus(wallet.getStatus());

        // Summary
        detailDTO.setSummary(summary);

        return detailDTO;
    }
    

    @Override
    @Transactional
    public void createManualRefund(AdminRefundRequestDTO refundRequest, String adminId) {
        // 1. Validate request
        if (refundRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Refund amount must be positive.");
        }

        // Kiểm tra user có ví không
        Wallet wallet = walletRepository.findByUserId(refundRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + refundRequest.getUserId()));

        // 2. Gọi TransactionService.createTransaction(REFUND, COMPLETED)
        WalletTransaction transaction = transactionService.createTransaction(
                refundRequest.getUserId(),
                TransactionType.REFUND,
                TransactionStatus.COMPLETED, // Refund thủ công auto-completed
                refundRequest.getAmount(),
                refundRequest.getReason(),
                refundRequest.getOrderId(), // Có thể null
                "MANUAL_ADMIN" // Payment method
        );

        // 3. Ghi log adminId và notes
        transaction.setAdminNotes("Manual refund by admin: " + refundRequest.getReason());
        transaction.setProcessedBy(adminId);
        transaction.setCompletedAt(LocalDateTime.now()); 
        transactionRepository.save(transaction);

        // 4. Gọi WalletService.updateBalance
        walletService.updateBalance(wallet.getWalletId(), refundRequest.getAmount(), TransactionType.REFUND);
    }


    @Override
    public Page<PendingRefundDTO> getPendingRefunds(int page, int size) {
        // 1. Tạo Pageable (ưu tiên các request cũ nhất)
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());

        // 2. Gọi transactionRepository (sử dụng phương thức findByTypeAndStatus)
        Page<WalletTransaction> refundPage = transactionRepository.findByTypeAndStatus(
                TransactionType.REFUND, 
                TransactionStatus.PENDING, 
                pageable);

        // 3. Lấy userIds
        List<String> userIds = refundPage.getContent().stream()
                .map(WalletTransaction::getUserId)
                .distinct()
                .collect(Collectors.toList());

        // 4. Lấy thông tin Users
        Map<String, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getUserId, user -> user)); //

        // 5. Map kết quả
        List<PendingRefundDTO> dtoList = refundPage.getContent().stream()
                .map(tx -> {
                    PendingRefundDTO dto = new PendingRefundDTO();
                    dto.setTransactionId(tx.getTransactionId());
                    dto.setUserId(tx.getUserId());
                    dto.setAmount(tx.getAmount());
                    dto.setOrderId(tx.getBookingId()); // Dùng booking_Id
                    dto.setReason(tx.getDescription()); // Dùng description (lý do user request)
                    dto.setRequestedAt(tx.getCreatedAt());

                    // Lấy thông tin user từ Map
                    User user = userMap.get(tx.getUserId());
                    if (user != null) {
                        dto.setUserEmail(user.getEmail()); //
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, refundPage.getTotalElements());
    }
}