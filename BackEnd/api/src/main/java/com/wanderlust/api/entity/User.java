package com.wanderlust.api.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String userId;

    private String firstName;
    private String lastName;
    private String avatar;
    private String email;
    private String mobile;
    private String password;
    private String role;
    private String address;
    private Boolean isBlocked;
    private String refreshToken;
    private LocalDateTime passwordChangeAt;
    private String passwordResetToken;
    private String registerToken;
}
