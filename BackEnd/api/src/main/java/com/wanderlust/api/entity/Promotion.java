package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "promotion")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Promotion {
    @Id
    private String promotion_ID;
    private String description;
    private Float discount_Percentage;
    private String applicable_service;
    private LocalDate start_date;
    private LocalDate end_date;
    private Duration duration;

    private String userId;
}
