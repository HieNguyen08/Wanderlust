package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.wanderlust.api.entity.types.LocationType;

@Document(collection = "location")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    @Id
    private String id; // Sửa location_ID -> id cho chuẩn Java/Spec
    
    // @Field dùng để mapping nếu tên biến Java khác tên trong DB (optional), 
    // nhưng ở đây ta sửa tên biến cho khớp spec luôn.
    private String name; // Sửa location_Name -> name
    
    private String slug;
    
    private LocationType type; // Sửa location_Type -> type
    
    private String parentLocationId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String timezone;
    private String description;
    
    private String image; // Sửa imageUrl -> image (để khớp spec)
    
    private Boolean featured;
    
    private Integer popularity; // Sửa popularityScore -> popularity
    
    // Quan trọng: Dùng Map<String, Object> để lưu JSON động
    // Ví dụ: { "weather": "tropical", "bestTimeToVisit": "May-Aug" }
    private Map<String, Object> metadata;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}