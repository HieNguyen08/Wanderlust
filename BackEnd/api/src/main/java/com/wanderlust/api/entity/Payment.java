package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    private String paymentId;

    private Float payment_Amount;
    private String payment_Method;
    private LocalDateTime payment_Date;
    private String Status;

    private String userId;
    private String booking_ID;
}
