package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    @Id
    private String id; // Sửa booking_Id -> id

    @Indexed(unique = true) // Đảm bảo mã booking là duy nhất
    private String bookingCode; // "WL123456"

    private String userId; // Người đặt

    private BookingType bookingType; // Enum: FLIGHT, HOTEL...

    // --- Polymorphic Relationships (Nullable IDs) ---
    // Tùy vào bookingType mà 1 trong các trường này sẽ có dữ liệu
    private List<String> flightId; // Changed to List to support round-trip (outbound + return)
    private List<String> flightSeatIds; // Danh sách ghế đã chọn cho chuyến bay
    private Integer seatCount;          // Số lượng ghế đã đặt (cho flight booking)
    private String hotelId;
    private List<String> roomIds;       // Danh sách phòng đã book (có thể book nhiều phòng)
    private String carRentalId; // Sửa car_Rental_ID -> carRentalId
    private String activityId;  // Thêm activityId

    // --- Dates --- (UPDATED TO LocalDateTime)
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime bookingDate;

    // --- Guest Info (JSON Structures) ---
    private GuestInfo guestInfo;       // Thông tin người liên hệ chính
    private GuestCount numberOfGuests; // Số lượng khách
    private String specialRequests;

    // --- Pricing (BigDecimal) ---
    private BigDecimal basePrice;
    private BigDecimal taxes;
    private BigDecimal fees;
    private BigDecimal discount;
    private BigDecimal totalPrice; // Sửa total_Price -> totalPrice
    private String currency;       // "VND"

    // --- Voucher ---
    private String voucherCode;
    private BigDecimal voucherDiscount;

    // --- Payment ---
    private PaymentStatus paymentStatus; // Enum
    private PaymentMethod paymentMethod; // Enum

    // --- Booking Status ---
    private BookingStatus status; // Enum

    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private String cancelledBy; // User ID hoặc Admin ID

    // --- Vendor Info ---
    private String vendorId;        // ID của đối tác cung cấp dịch vụ
    private Boolean vendorConfirmed;
    private Boolean vendorRefundApproved; // Vendor đồng ý (true) / không đồng ý (false) hoàn tiền; null = chưa phản hồi
    
    // --- Completion Tracking --- (NEW)
    private Boolean userConfirmed;  // Người dùng xác nhận hoàn thành
    private Boolean autoCompleted;  // Tự động hoàn thành bởi hệ thống

    // --- Review Tracking ---
    private Boolean hasReview;      // User đã đánh giá booking này chưa

    // --- Additional Data ---
    // Dùng Map để lưu dữ liệu đặc thù của từng loại booking
    // VD Flight: { "seatNumber": "12A", "baggage": "20kg" }
    private Map<String, Object> metadata;

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ==========================================
    // INNER CLASSES (Mapping cho JSON Structures)
    // ==========================================

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestInfo {
        private String fullName;
        private String email;
        private String phone;
        private String passportNumber; // Optional
        private LocalDate dob;         // Optional
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestCount {
        private Integer adults;
        private Integer children;
        private Integer infants;
    }
}