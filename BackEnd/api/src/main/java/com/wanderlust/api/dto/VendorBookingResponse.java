package com.wanderlust.api.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorBookingResponse {
    private String id;
    private String bookingCode;

    private String customer;
    private String email;
    private String phone;

    private String service;
    private String serviceType;

    private String checkIn;
    private String checkOut;
    private Integer guests;

    private String status;
    private String payment;
    private BigDecimal amount;
    private String bookingDate;

    private Boolean vendorConfirmed;
    private Boolean userConfirmed;
    private Boolean autoCompleted;
}
