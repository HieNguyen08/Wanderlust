package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

// Import các Enum vừa tạo
import com.wanderlust.api.entity.types.CarType;
import com.wanderlust.api.entity.types.TransmissionType;
import com.wanderlust.api.entity.types.FuelType;
import com.wanderlust.api.entity.types.FuelPolicy;
import com.wanderlust.api.entity.types.CarStatus;

@Document(collection = "car_rental")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarRental {
    @Id
    private String id; // Sửa rental_ID -> id

    private String vendorId;   // Sửa userId -> vendorId
    private String locationId; // FK to Location

    // --- Car Details ---
    private String brand; // "Toyota"
    private String model; // "Camry" (Sửa car_Model -> model)
    private Integer year;

    private CarType type; // Enum (Sửa car_Type -> type)
    
    private TransmissionType transmission; // Enum
    private FuelType fuelType; // Enum

    private Integer seats;
    private Integer doors;
    private Integer luggage; // Số va-li chứa được

    private String color;
    private String licensePlate;

    // --- Images & Features ---
    // images: json -> List Object
    private List<CarImage> images; 
    
    // features: ["GPS", "Camera"] -> List String
    private List<String> features; 

    // --- Pricing (BigDecimal) ---
    private BigDecimal pricePerDay;  // Sửa rental_Cost -> pricePerDay
    private BigDecimal pricePerHour; // Optional

    // --- Driver Option ---
    private Boolean withDriver;
    private BigDecimal driverPrice; // Optional

    // --- Insurance (JSON Object) ---
    private InsuranceInfo insurance;

    // --- Rental Policy ---
    private BigDecimal deposit; // Tiền cọc
    
    private FuelPolicy fuelPolicy; // Enum
    
    private Integer mileageLimit; // km/day (null = unlimited)
    private Integer minRentalDays;
    
    private Boolean deliveryAvailable;
    private BigDecimal deliveryFee;

    // --- Status & Stats ---
    private CarStatus status; // Enum
    
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalTrips;

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ==========================================
    // INNER CLASSES (Mapping cho JSON Structures)
    // ==========================================

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CarImage {
        private String url;
        private String caption;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InsuranceInfo {
        private String type;     // "Basic", "Premium"
        private String coverage; // Mô tả bảo hiểm
        private BigDecimal price; // Giá bảo hiểm
    }
}