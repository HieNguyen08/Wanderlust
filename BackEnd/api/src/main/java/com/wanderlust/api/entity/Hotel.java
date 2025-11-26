package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.HotelStatusType;
import com.wanderlust.api.entity.types.HotelType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "hotel")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Hotel {
    @Id
    private String hotelID; // id
    private String vendorId;
    private String locationId;
    private String name;
    private String slug;
    private HotelType hotelType; // type
    private Integer starRating; // starRating
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
    private String shortDescription;
    private String phone;
    private String email;
    private String website;

    // JSON Structures (Mapping phức tạp)
    // Lưu ý: MongoDB sẽ tự động map các List/Object này thành JSON array/object
    private List<HotelImage> images;
    private List<String> amenities; // Sửa lại từ String thành List<String> để đúng spec JSON
    private HotelPolicies policies; // Sửa lại từ String thành Object để đúng spec JSON

    private HotelStatusType status;

    private Boolean featured;
    private Boolean verified;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalRooms;
    private BigDecimal lowestPrice;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HotelImage {
        private String url;
        private String caption;
        private Integer order;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HotelPolicies {
        private String cancellation; // Chính sách hủy
        private Boolean pets; // Thú cưng (true/false) hoặc String mô tả
        private Boolean smoking; // Hút thuốc
    }
}