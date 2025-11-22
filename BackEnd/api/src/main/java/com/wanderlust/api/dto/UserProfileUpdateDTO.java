package com.wanderlust.api.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.wanderlust.api.configure.GenderDeserializer;
import com.wanderlust.api.entity.types.Gender;

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
    
    @JsonDeserialize(using = GenderDeserializer.class)
    private Gender gender;
}