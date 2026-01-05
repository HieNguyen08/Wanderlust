package com.wanderlust.api.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.AuthProvider;
import com.wanderlust.api.entity.types.Gender;
import com.wanderlust.api.entity.types.MembershipLevel;
import com.wanderlust.api.entity.types.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@CompoundIndexes({
    @CompoundIndex(name = "email_unique_idx", 
                   def = "{'email': 1}", unique = true),
    @CompoundIndex(name = "role_status_idx", 
                   def = "{'role': 1, 'isBlocked': 1}"),
    @CompoundIndex(name = "membership_points_idx", 
                   def = "{'membershipLevel': 1, 'loyaltyPoints': -1}"),
    @CompoundIndex(name = "vendor_request_idx", 
                   def = "{'vendorRequestStatus': 1, 'createdAt': -1}")
})
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
    
    @Indexed(unique = true)
    private String email;
    private AuthProvider provider;
    private String providerId;
    private String mobile;
    private String password;
    private Role role;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String country;
    private String passportNumber;
    private LocalDate passportExpiryDate;
    private MembershipLevel membershipLevel; // BRONZE, SILVER, GOLD, PLATINUM
    private Integer loyaltyPoints; // Điểm tích lũy (hiện: 2,450)
    private Integer totalTrips; // Tổng số chuyến đi (hiện: 12)
    private Integer totalReviews; // Số đánh giá đã viết (hiện: 8)
    private LocalDateTime createdAt; // Ngày tạo tài khoản
    private LocalDateTime updatedAt; // Lần cập nhật cuối
    private LocalDateTime lastLoginAt; // Lần đăng nhập cuố
    private NotificationSettings notificationSettings;
    private Boolean isBlocked;
    private String refreshToken;
    private LocalDateTime passwordChangeAt;
    private String passwordResetToken;
    private String registerToken;
    private String vendorRequestStatus; // Ví dụ: "NONE", "PENDING", "APPROVED"

}
