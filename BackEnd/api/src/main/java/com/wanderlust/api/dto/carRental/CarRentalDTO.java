package com.wanderlust.api.dto.carRental;

import com.wanderlust.api.entity.types.*;
import com.wanderlust.api.entity.CarRental.CarImage;
import com.wanderlust.api.entity.CarRental.InsuranceInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarRentalDTO {
    private String id;
    private String vendorId;
    private String locationId;

    private String brand;
    private String model;
    private Integer year;
    private CarType type;
    
    private TransmissionType transmission;
    private FuelType fuelType;

    private Integer seats;
    private Integer doors;
    private Integer luggage;
    
    private String color;
    private String licensePlate;

    private List<CarImage> images;
    private List<String> features;

    private BigDecimal pricePerDay;
    private BigDecimal pricePerHour;

    private Boolean withDriver;
    private BigDecimal driverPrice;

    private InsuranceInfo insurance;

    private BigDecimal deposit;
    private FuelPolicy fuelPolicy;
    private Integer mileageLimit;
    private Integer minRentalDays;
    
    private Boolean deliveryAvailable;
    private BigDecimal deliveryFee;

    private CarStatus status;
    
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalTrips;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}