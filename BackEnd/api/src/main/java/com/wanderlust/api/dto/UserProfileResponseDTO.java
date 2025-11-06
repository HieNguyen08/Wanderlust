package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.Gender;
import com.wanderlust.api.entity.types.Role;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserProfileResponseDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String avatar;
    private Gender gender;
    private String email;
    private String mobile;
    private Role role;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String country;
    private String passportNumber;
    private LocalDate passportExpiryDate;
    private LocalDateTime createdAt;
    private String partnerRequestStatus;
}