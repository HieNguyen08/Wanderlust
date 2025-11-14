package com.wanderlust.api.services.impl;

// Import DTOs
import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.dto.walletDTO.TransactionSummaryDTO;

// Import Entities
import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.User; // <-- IMPORT MỚI

// Import Enums
import com.wanderlust.api.entity.types.TransactionStatus;
import com.wanderlust.api.entity.types.TransactionType;
import com.wanderlust.api.exception.ResourceNotFoundException;

// Import Repositories & Services
import com.wanderlust.api.repository.WalletRepository;
import com.wanderlust.api.repository.WalletTransactionRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.UserRepository; // <-- IMPORT MỚI
import com.wanderlust.api.services.TransactionService;
import com.wanderlust.api.services.FlightService;
import com.wanderlust.api.services.ActivityService;
import com.wanderlust.api.services.CarRentalService;

// Import Mappers
import com.wanderlust.api.mapper.TransactionMapper; 

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Sử dụng constructor injection
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final WalletTransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final TransactionMapper transactionMapper;
    
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final FlightService flightService;
    private final ActivityService activityService;
    private final CarRentalService carRentalService;
    
    private final UserRepository userRepository;


    @Override
    @Transactional
    public WalletTransaction createTransaction(String userId, TransactionType type, TransactionStatus status, BigDecimal amount, String description, String orderId, String paymentMethod) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));
        WalletTransaction transaction = WalletTransaction.builder()
                .userId(userId).walletId(wallet.getWalletId())
                .type(type).amount(amount).description(description)
                .status(status).bookingId(orderId)
                .paymentMethod(paymentMethod).createdAt(LocalDateTime.now())
                .build();
        return transactionRepository.save(transaction);
    }

    @Override
    public Page<TransactionResponseDTO> getUserTransactions(String userId, int page, int size, TransactionType type, TransactionStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // (Giả sử WalletTransactionRepository có các hàm findBy...)
        Page<WalletTransaction> transactionPage;
        if (type != null && status != null) {
            transactionPage = transactionRepository.findByUserIdAndTypeAndStatus(userId, type, status, pageable);
        } else if (type != null) {
            transactionPage = transactionRepository.findByUserIdAndType(userId, type, pageable);
        } else if (status != null) {
            transactionPage = transactionRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            transactionPage = transactionRepository.findByUserId(userId, pageable);
        }
        List<TransactionResponseDTO> dtoList = transactionPage.getContent().stream()
                .map(transactionMapper::toTransactionResponseDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, transactionPage.getTotalElements());
    }

    @Override
    @Transactional
    public void updateTransactionStatus(String transactionId, TransactionStatus newStatus, String paymentGatewayRef) {
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));
        transaction.setStatus(newStatus);
        if (paymentGatewayRef != null) {
            transaction.setPaymentGatewayRef(paymentGatewayRef);
        }
        if (newStatus == TransactionStatus.COMPLETED) {
            transaction.setCompletedAt(LocalDateTime.now());
        } else if (newStatus == TransactionStatus.FAILED) {
            transaction.setFailedAt(LocalDateTime.now());
        }
        transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void processAutoRefund(String orderId, String userId, BigDecimal amount, String reason) {
        createTransaction(userId, TransactionType.REFUND, TransactionStatus.COMPLETED,
                amount, reason, orderId, "SYSTEM_AUTO_REFUND");
    }

    @Override
    @Transactional
    public void createPendingRefund(String orderId, String userId, BigDecimal amount, String reason) {
        createTransaction(userId, TransactionType.REFUND, TransactionStatus.PENDING,
                amount, reason, orderId, "USER_REQUEST_REFUND");
    }


    // === HÀM ĐƯỢC CẬP NHẬT HOÀN CHỈNH ===
    
    @Override
    @Transactional(readOnly = true)
    public TransactionDetailDTO getTransactionDetail(String transactionId) {
        
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));
        
        // 1. Map DTO cơ bản
        // TransactionMapper does not expose toTransactionDTO(...), so create a detail DTO instance here;
        // you can later populate it from transactionMapper.toTransactionResponseDTO(transaction) if needed.
        TransactionDetailDTO detailDTO = new TransactionDetailDTO();

        // 2. Làm giàu (Enrich) DTO nếu có bookingId
        if (detailDTO.getBookingId() != null) {
            String bookingId = detailDTO.getBookingId();
            
            try {
                // Lấy Booking
                Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);

                if (bookingOpt.isPresent()) {
                    Booking booking = bookingOpt.get();
                    
                    // 3. Lấy tên dịch vụ (từ hàm helper bên dưới)
                    String serviceName = getServiceNameForBooking(booking);
                    detailDTO.setServiceName(serviceName);
                    
                    // === PHẦN TODO ĐÃ HOÀN THÀNH ===
                    if (booking.getVendorId() != null) {
                        // Tìm Vendor (User) bằng ID [cite: 3]
                        Optional<User> vendorOpt = userRepository.findByUserId(booking.getVendorId());
                        
                        if (vendorOpt.isPresent()) {
                            User vendor = vendorOpt.get();
                            // Kết hợp tên 
                            String vendorName = vendor.getFirstName() + " " + vendor.getLastName();
                            detailDTO.setVendorName(vendorName);
                        } else {
                            log.warn("Vendor (User) not found for ID: {} (Booking ID: {})", booking.getVendorId(), bookingId);
                            detailDTO.setVendorName("Đối tác không tìm thấy");
                        }
                    } else {
                        // Nếu booking không có vendorId (VD: Flight), tên đối tác là "Wanderlust"
                        detailDTO.setVendorName("Wanderlust");
                    }
                    // === KẾT THÚC PHẦN HOÀN THÀNH ===
                    
                } else {
                    log.warn("Booking not found with ID: {}. (Transaction ID: {})", bookingId, transactionId);
                }

            } catch (Exception e) {
                log.error("Failed to enrich transaction detail for booking {}: {}", bookingId, e.getMessage());
                detailDTO.setServiceName("Lỗi khi tải chi tiết dịch vụ");
            }
        }
        
        return detailDTO;
    }

    /**
     * Helper private để lấy tên dịch vụ từ Booking
     */
    private String getServiceNameForBooking(Booking booking) {
        String serviceName = "Dịch vụ không xác định";
        
        try {
            switch (booking.getBookingType()) {
                case HOTEL:
                    if (booking.getHotelId() != null) {
                        Hotel hotel = hotelRepository.findById(booking.getHotelId()).orElse(null);
                        if (hotel != null) serviceName = "Khách sạn: " + hotel.getName();
                    }
                    break;
                case ACTIVITY:
                    if (booking.getActivityId() != null) {
                        Activity activity = activityService.findById(booking.getActivityId());
                        if (activity != null) serviceName = "Hoạt động: " + activity.getName();
                    }
                    break;
                case CAR:
                    if (booking.getCarRentalId() != null) {
                        CarRental car = carRentalService.findById(booking.getCarRentalId());
                        if (car != null) serviceName = "Thuê xe: " + car.getBrand() + " " + car.getModel();
                    }
                    break;
                case FLIGHT:
                    if (booking.getFlightId() != null) {
                        Flight flight = flightService.getFlightById(booking.getFlightId()).orElse(null);
                        if (flight != null) serviceName = "Chuyến bay: " + flight.getFlightNumber() + " (" + flight.getAirlineName() + ")";
                    }
                    break;
                default:
                    serviceName = "Booking: " + booking.getBookingCode();
            }
        } catch (Exception e) {
            log.warn("Error resolving service name for booking {}: {}", booking.getId(), e.getMessage());
            serviceName = "Dịch vụ (Booking " + booking.getBookingCode() + ")";
        }
        
        return serviceName;
    }
    
    // === HÀM TÍNH TOÁN CUỐI CÙNG (Giữ nguyên) ===

    @Override
    public TransactionSummaryDTO getTransactionSummary(String userId) {
        List<WalletTransaction> credits = transactionRepository.findCompletedByUserIdAndType(userId, TransactionType.CREDIT);
        List<WalletTransaction> debits = transactionRepository.findCompletedByUserIdAndType(userId, TransactionType.DEBIT);
        List<WalletTransaction> refunds = transactionRepository.findCompletedByUserIdAndType(userId, TransactionType.REFUND);

        BigDecimal totalCredit = calculateTotalAmount(credits);
        BigDecimal totalDebit = calculateTotalAmount(debits);
        BigDecimal totalRefund = calculateTotalAmount(refunds);

        return TransactionSummaryDTO.builder()
                .totalCredit(totalCredit)
                .totalDebit(totalDebit)
                .totalRefund(totalRefund)
                .build();
    }

    private BigDecimal calculateTotalAmount(List<WalletTransaction> transactions) {
        return transactions.stream()
                .map(WalletTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}