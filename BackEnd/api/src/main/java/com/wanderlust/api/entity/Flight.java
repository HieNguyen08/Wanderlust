package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.FlightStatus;

@Document(collection = "flights")
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
    private String airlineLogo;  // URL logo hãng bay

    // --- Departure ---
    private String departureAirportCode; // "SGN"
    private String departureAirportName; // "Sân bay Tân Sơn Nhất"
    private String departureCity;        // "TP. Hồ Chí Minh"
    private String departureTerminal;    // "Nhà ga 1", "Nhà ga 2"
    private LocalDateTime departureTime;

    // --- Arrival ---
    private String arrivalAirportCode; // "HAN"
    private String arrivalAirportName; // "Sân bay Nội Bài"
    private String arrivalCity;        // "Hà Nội"
    private String arrivalTerminal;    // "Nhà ga 1"
    private LocalDateTime arrivalTime;

    // --- Flight Metrics ---
    private Integer durationMinutes;   // Thời gian bay (phút)
    private String durationDisplay;    // "1h 10p", "2h 15p"
    private Integer distanceKm;        // Khoảng cách (km)
    private Boolean isDirect;          // true = bay thẳng, false = có dừng

    // --- Stops (nếu có) ---
    private Integer stops;             // Số lần dừng (0 = direct)
    private List<StopInfo> stopInfo;   // Chi tiết các điểm dừng

    // --- Aircraft ---
    private String aircraftType;       // "Airbus A321", "Boeing 787"
    private String aircraftCode;       // "A321", "B787"

    // --- Cabin Classes & Pricing ---
    // Map<String, CabinClassInfo>: { "economy": {...}, "premiumEconomy": {...}, "business": {...} }
    private Map<String, CabinClassInfo> cabinClasses;

    // --- Status & Availability ---
    private FlightStatus status;       // SCHEDULED, DELAYED, CANCELLED, BOARDING, DEPARTED, ARRIVED
    private Integer totalSeats;        // Tổng số ghế
    private Integer availableSeats;    // Số ghế còn trống

    // --- Additional Info ---
    private List<String> amenities;    // ["wifi", "meal", "entertainment", "power"]
    private String operatedBy;         // "Operated by Vietnam Airlines"
    private Boolean isInternational;   // true = quốc tế, false = nội địa

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ==========================================
    // INNER CLASSES
    // ==========================================

    /**
     * Thông tin điểm dừng
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StopInfo {
        private String airportCode;    // "DAD"
        private String city;           // "Đà Nẵng"
        private Integer durationMinutes; // Thời gian dừng (phút)
    }

    /**
     * Thông tin hạng vé (Economy, Premium Economy, Business)
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CabinClassInfo {
        private Boolean available;         // Còn vé không?
        private BigDecimal fromPrice;      // Giá thấp nhất của hạng này
        private List<FareOption> fares;    // Các loại vé trong hạng
    }

    /**
     * Loại vé cụ thể (Standard, Flex, Super Flex...)
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FareOption {
        private String id;                 // "eco-standard", "eco-flex"
        private String name;               // "Phổ thông Tiêu chuẩn"
        private BigDecimal price;          // Giá vé
        private String baggage;            // "7kg xách tay"
        private String checkedBag;         // "20kg" hoặc "Không"
        private Boolean refundable;        // Có hoàn tiền không?
        private Boolean changeable;        // Có đổi vé không?
        private Integer miles;             // Dặm tích lũy
        private Integer availableSeats;    // Số ghế còn trống cho loại vé này
    }
}