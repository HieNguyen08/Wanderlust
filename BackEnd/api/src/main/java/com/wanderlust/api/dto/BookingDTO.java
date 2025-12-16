package com.wanderlust.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map; // Cho guestInfo, numberOfGuests

import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;

import lombok.Data;

@Data
public class BookingDTO {
    
    // --- ID & Thông tin chính ---
    private String id;
    private String bookingCode;
    private String userId;
    private String vendorId; // Sẽ được service tự gán
    private BookingType bookingType;
    private BookingStatus status;
    private LocalDateTime bookingDate;

    // --- ID Dịch vụ liên quan (Polymorphic) ---
    private List<String> flightId; // Support one-way (1) or round-trip (2)
    private List<String> flightSeatIds;
    private Integer seatCount;
    private String hotelId;
    private String roomId;
    private String carRentalId;
    private String activityId;

    // --- Ngày giờ ---
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // --- Thông tin Khách (JSON) ---
    private Map<String, Object> guestInfo; // {name, email, phone, passport}
    private Map<String, Integer> numberOfGuests; // {adults, children, infants}
    private String specialRequests;

    // --- Giá cả (Pricing) ---
    private BigDecimal basePrice;
    private BigDecimal taxes;
    private BigDecimal fees;
    private BigDecimal discount;
    private BigDecimal totalPrice;
    private String currency;

    // --- Voucher ---
    private String voucherCode;
    private BigDecimal voucherDiscount;

    // --- Thanh toán & Hủy ---
    private PaymentStatus paymentStatus; // "pending", "paid", "failed"
    private PaymentMethod paymentMethod; // "credit_card", "momo"
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private String cancelledBy;
    private Boolean vendorConfirmed;
    private Boolean vendorRefundApproved;

    // --- Review flag ---
    private Boolean hasReview;

    // --- Completion Tracking ---
    private Boolean userConfirmed;  // Người dùng xác nhận hoàn thành
    private Boolean autoCompleted;  // Tự động hoàn thành bởi hệ thống

    // --- Additional ---
    private Map<String, Object> metadata;
}