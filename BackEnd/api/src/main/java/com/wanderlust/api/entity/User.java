package com.wanderlust.api.entity;

import com.wanderlust.api.entity.types.Gender;
import com.wanderlust.api.entity.types.Role;

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
    private String address;
    private Boolean isBlocked;
    private String refreshToken;
    private LocalDateTime passwordChangeAt;
    private String passwordResetToken;
    private String registerToken;
    private String partnerRequestStatus; // Ví dụ: "NONE", "PENDING", "APPROVED"

}
