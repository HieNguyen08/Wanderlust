package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map; // Cho guestInfo, numberOfGuests

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
    private String flightId;
    private String hotelId;
    private String roomId;
    private String carRentalId;
    private String activityId;

    // --- Ngày giờ ---
    private LocalDate startDate;
    private LocalDate endDate;

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

    // --- Thanh toán & Hủy ---
    private PaymentStatus paymentStatus; // "pending", "paid", "failed"
    private PaymentMethod paymentMethod; // "credit_card", "momo"
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private String cancelledBy;
    private Boolean vendorConfirmed;

    // --- Completion Tracking ---
    private Boolean userConfirmed;  // Người dùng xác nhận hoàn thành
    private Boolean autoCompleted;  // Tự động hoàn thành bởi hệ thống
}