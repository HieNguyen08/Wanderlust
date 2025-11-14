package com.wanderlust.api.dto.carRental;

import lombok.Data;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;

@Data
public class CarPriceCalculationDTO {
    @NotNull
    private LocalDateTime startDate;
    
    @NotNull
    private LocalDateTime endDate;
    
    private Boolean withDriver;
}