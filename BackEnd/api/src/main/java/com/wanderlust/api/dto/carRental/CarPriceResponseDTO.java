package com.wanderlust.api.dto.carRental;

import lombok.AllArgsConstructor;
import lombok.Builder; // Thêm import
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@Builder // Thêm @Builder
public class CarPriceResponseDTO {
    private BigDecimal basePrice;
    private BigDecimal driverFee;
    private BigDecimal serviceFee;
    private BigDecimal totalPrice;
    private int totalDays;
}