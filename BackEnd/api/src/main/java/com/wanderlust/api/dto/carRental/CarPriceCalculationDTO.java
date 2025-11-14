package com.wanderlust.api.dto.carRental;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CarPriceCalculationDTO {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean withDriver; // Có thuê tài xế không
}