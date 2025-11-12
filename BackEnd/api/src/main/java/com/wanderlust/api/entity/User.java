package com.wanderlust.api.entity;

import com.wanderlust.api.entity.types.Gender;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.entity.types.MembershipLevel;
import com.wanderlust.api.entity.NotificationSettings;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class User {
    @Id
    private String userId;

    private String firstName;
    private String lastName;
    private String avatar;
    private Gender gender;
    private String email;
    private String mobile;
    private String password;
    private Role role;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String country;
    private String passportNumber;
    private LocalDate passportExpiryDate;
    private MembershipLevel membershipLevel;  // BRONZE, SILVER, GOLD, PLATINUM
    private Integer loyaltyPoints;         // Điểm tích lũy (hiện: 2,450)
    private Integer totalTrips;            // Tổng số chuyến đi (hiện: 12)
    private Integer totalReviews;          // Số đánh giá đã viết (hiện: 8)
    private LocalDateTime createdAt;       // Ngày tạo tài khoản
    private LocalDateTime updatedAt;       // Lần cập nhật cuối
    private LocalDateTime lastLoginAt;     // Lần đăng nhập cuố
    private NotificationSettings notificationSettings;
    private Boolean isBlocked;
    private String refreshToken;
    private LocalDateTime passwordChangeAt;
    private String passwordResetToken;
    private String registerToken;
    private String partnerRequestStatus; // Ví dụ: "NONE", "PENDING", "APPROVED"

}
