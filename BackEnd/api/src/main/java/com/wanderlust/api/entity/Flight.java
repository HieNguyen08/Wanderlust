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
import com.wanderlust.api.entity.types.CabinClass;
import com.wanderlust.api.entity.types.FlightStatus;

@Document(collection = "flight")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flight {
    @Id
    private String id;

    // --- Airline Info ---
    private String flightNumber; // VD: "VN123"
    private String airlineCode;  // VD: "VN"
    private String airlineName;  // VD: "Vietnam Airlines"
    private String airlineLogo;  // URL

    // --- Departure ---
    private String departureAirportCode; // "SGN"
    private String departureAirportName;
    private String departureCity;
    private String departureTerminal; // Optional
    private LocalDateTime departureTime;

    // --- Arrival ---
    private String arrivalAirportCode; // "HAN"
    private String arrivalAirportName;
    private String arrivalCity;
    private String arrivalTerminal; // Optional
    private LocalDateTime arrivalTime;

    // --- Flight Metrics ---
    private Integer duration; // Minutes (theo spec là integer)
    private Integer distance; // Kilometers
    private Integer stops;    // 0 = direct

    // JSON: [{city, duration}]
    private List<StopInfo> stopInfo; 

    // --- Aircraft & Class ---
    private String aircraftType; // "Boeing 787"
    private CabinClass cabinClass; // Enum

    // --- Pricing (Dùng BigDecimal cho tiền) ---
    private BigDecimal basePrice;
    private BigDecimal taxesFees;
    private BigDecimal totalPrice;

    // --- Availability ---
    private Integer totalSeats;
    private Integer availableSeats;

    // --- JSON Fields ---
    private BaggageInfo baggage; // JSON Object {checkedBag, carryOn}
    private List<String> amenities; // JSON Array ["wifi", "meal"]

    // --- Status ---
    private FlightStatus status; // Enum

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
    public static class StopInfo {
        private String city;
        private Integer duration; // Minutes dừng tại trạm
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BaggageInfo {
        private String checkedBag; // VD: "23kg"
        private String carryOn;    // VD: "7kg"
    }
}