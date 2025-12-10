package com.wanderlust.api.entity;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.wanderlust.api.entity.types.PromotionCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "promotions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Promotion {
    
    @Id
    private String id;

    @Field("code")
    private String code;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("image")
    private String image;

    @Field("type")
    private String type; // PERCENTAGE or FIXED_AMOUNT

    @Field("value")
    private Double value;

    @Field("maxDiscount")
    private Double maxDiscount;

    @Field("minSpend")
    private Double minSpend;

    @Field("startDate")
    private LocalDate startDate;

    @Field("endDate")
    private LocalDate endDate;

    @Field("category")
    private PromotionCategory category; // Enum: HOTEL, FLIGHT, CAR, ACTIVITY, ALL

    @Field("vendorId")
    private String vendorId; // ID của vendor tạo promotion (null nếu admin tạo)

    @Field("adminCreateCheck")
    private Boolean adminCreateCheck; // true = admin tạo, false = vendor tạo

    @Field("destination")
    private String destination;

    @Field("badge")
    private String badge;

    @Field("badgeColor")
    private String badgeColor;

    @Field("isFeatured")
    private Boolean isFeatured = false;

    @Field("totalUsesLimit")
    private Integer totalUsesLimit;

    @Field("usedCount")
    private Integer usedCount = 0;

    @Field("conditions")
    private List<String> conditions;

    @Field("applicableServices")
    private List<ApplicableService> applicableServices;

    // Nested class for applicable services
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ApplicableService {
        private String id;
        private String name;
        private String image;
        private Double price;
    }

    // Computed field for days left
    public Integer getDaysLeft() {
        if (endDate == null) return null;
        long days = ChronoUnit.DAYS.between(LocalDate.now(), endDate);
        return (int) days;
    }

    // Check if promotion is active
    public boolean isActive() {
        LocalDate now = LocalDate.now();
        return (startDate == null || !now.isBefore(startDate)) && 
               (endDate == null || !now.isAfter(endDate));
    }

    // Check if promotion is available (not exhausted)
    public boolean isAvailable() {
        return totalUsesLimit == null || usedCount < totalUsesLimit;
    }
}
