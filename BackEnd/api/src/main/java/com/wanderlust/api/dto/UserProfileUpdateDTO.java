package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.Gender;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UserProfileUpdateDTO {
    private String firstName;
    private String lastName;
    private String avatar;
    private String mobile;
    private String address;
    private LocalDate dateOfBirth;
    private String city;
    private String country;
    private String passportNumber;
    private LocalDate passportExpiry;
    private Gender gender;
}