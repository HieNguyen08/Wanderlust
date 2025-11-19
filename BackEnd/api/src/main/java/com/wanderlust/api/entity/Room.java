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

// Import các Enum (Giả định bạn đã/sẽ tạo các enum này trong package types)
import com.wanderlust.api.entity.types.RoomType;
import com.wanderlust.api.entity.types.RoomStatusType;
import com.wanderlust.api.entity.types.CancellationPolicyType;

@Document(collection = "room")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    @Id
    private String id; // Sửa room_ID -> id

    private String hotelId; // Sửa hotel_ID -> hotelId

    private String name;
    private String slug;
    
    private RoomType type; // Sửa room_Type (String) -> RoomType (Enum)
    
    private Integer maxOccupancy;
    private String bedType;
    private BigDecimal size; // size (m2) nên dùng BigDecimal hoặc Double
    private String description;

    // JSON Structures
    // images: [{url, caption, order}]
    private List<RoomImage> images; 
    
    // amenities: ["wifi", "tv", "minibar"]
    private List<String> amenities; 

    private BigDecimal basePrice; // Sửa price (Float) -> basePrice (BigDecimal)
    private BigDecimal originalPrice; // Giá gốc trước khi giảm
    
    private Integer totalRooms;
    private Integer availableRooms;
    
    private CancellationPolicyType cancellationPolicy; // Enum
    
    private Boolean refundable;
    private Boolean breakfastIncluded;
    
    // Room options - different pricing/breakfast combinations
    private List<RoomOption> options;
    
    private RoomStatusType status; // Sửa status (String) -> RoomStatusType (Enum)

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // --- INNER CLASSES (Định nghĩa cấu trúc cho JSON Object) ---
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoomImage {
        private String url;
        private String caption;
        private Integer order;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoomOption {
        private String id;
        private String name; // "Without Breakfast", "Breakfast for 2"
        private String bedType;
        private Boolean breakfast;
        private Boolean cancellation;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer roomsLeft;
        private Integer earnPoints;
    }
}