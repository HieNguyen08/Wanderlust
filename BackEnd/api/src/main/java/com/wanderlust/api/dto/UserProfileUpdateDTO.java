package com.wanderlust.api.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    
    // Support both passportExpiry and passportExpiryDate from frontend
    @JsonProperty(value = "passportExpiryDate", access = JsonProperty.Access.WRITE_ONLY)
    private LocalDate passportExpiryDate;
    
    private Gender gender;
    
    // Setter để hỗ trợ passportExpiry từ frontend (alias)
    @JsonProperty("passportExpiry")
    public void setPassportExpiry(LocalDate passportExpiry) {
        this.passportExpiryDate = passportExpiry;
    }
    
    // Getter cho passportExpiryDate
    public LocalDate getPassportExpiryDate() {
        return this.passportExpiryDate;
    }
}