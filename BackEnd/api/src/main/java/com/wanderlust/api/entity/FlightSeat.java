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

// Import các Enum
import com.wanderlust.api.entity.types.SeatType;
import com.wanderlust.api.entity.types.SeatStatus;
import com.wanderlust.api.entity.types.CabinClass;

@Document(collection = "flight_seat") // MongoDB convention thường dùng snake_case cho tên collection
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlightSeat {
    @Id
    private String id; // Sửa seat_ID -> id

    private String flightId; // Sửa flight_ID -> flightId

    private String seatNumber; // VD: "12A"
    
    private SeatType seatType; // Enum: WINDOW, MIDDLE, AISLE

    private Integer row;
    private String position; // "A", "B", "C"

    private CabinClass cabinClass; // Enum: ECONOMY, BUSINESS...

    private Boolean isExitRow;
    private Boolean extraLegroom;

    private BigDecimal price; // Extra fee (Dùng BigDecimal cho tiền)

    private SeatStatus status; // Enum thay cho Boolean availability
    

    // JSON features: ["power", "reclining"] -> Map thành List String
    private List<String> features;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}