package com.wanderlust.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class PromotionDTO {
    @Id
    private String promotion_ID;
    private String description;
    private Float discount_Percentage;
    private String applicable_service;
    private LocalDate start_date;
    private LocalDate end_date;
    private Duration duration;
}
