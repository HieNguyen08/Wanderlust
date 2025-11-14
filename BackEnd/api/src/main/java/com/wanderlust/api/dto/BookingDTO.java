package com.wanderlust.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    
    private String id;
    private String bookingCode; // Read-only (Server generates)
    
    private String userId;
    private BookingType bookingType;

    // --- IDs của dịch vụ (Polymorphic) ---
    private String flightId;
    private String hotelId;
    private String roomId;
    private String carRentalId;
    private String activityId;

    // --- Dates ---
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime bookingDate;

    // --- Guest Info ---
    private GuestInfoDTO guestInfo;
    private GuestCountDTO numberOfGuests;
    private String specialRequests;

    // --- Pricing ---
    private BigDecimal basePrice;
    private BigDecimal taxes;
    private BigDecimal fees;
    private BigDecimal discount;
    private BigDecimal totalPrice;
    private String currency;

    // --- Voucher ---
    private String voucherCode;
    private BigDecimal voucherDiscount;

    // --- Payment & Status ---
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private BookingStatus status;

    // --- Cancel Info ---
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private String cancelledBy;

    // --- Vendor Info ---
    private String vendorId;
    private Boolean vendorConfirmed;

    // --- Metadata ---
    private Map<String, Object> metadata;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // =====================
    // INNER DTO CLASSES
    // =====================
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestInfoDTO {
        private String fullName;
        private String email;
        private String phone;
        private String passportNumber;
        private LocalDate dob;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestCountDTO {
        private Integer adults;
        private Integer children;
        private Integer infants;
    }
}