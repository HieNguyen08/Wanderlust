package com.wanderlust.api.dto.carRental;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class CarPriceResponseDTO {
    private BigDecimal basePrice;
    private BigDecimal driverFee;
    private BigDecimal serviceFee;
    private BigDecimal totalPrice;
    private int totalDays;
}