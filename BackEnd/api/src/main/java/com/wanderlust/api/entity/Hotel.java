package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.ApprovalStatus;
import com.wanderlust.api.entity.types.HotelStatusType;
import com.wanderlust.api.entity.types.HotelType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "hotels")
@CompoundIndexes({
    @CompoundIndex(name = "location_search_idx", 
                   def = "{'locationId': 1, 'status': 1, 'approvalStatus': 1, 'starRating': -1, 'lowestPrice': 1}"),
    @CompoundIndex(name = "vendor_hotels_idx", 
                   def = "{'vendorId': 1, 'status': 1, 'approvalStatus': 1}"),
    @CompoundIndex(name = "featured_idx", 
                   def = "{'featured': 1, 'verified': 1, 'averageRating': -1}"),
    @CompoundIndex(name = "rating_price_idx", 
                   def = "{'starRating': 1, 'lowestPrice': 1}")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Hotel {
    @Id
    private String hotelID; // id
    private String vendorId;
    private String locationId;
    private String city;
    private String country;
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

    // approvalStatus: admin duyệt; status: vận hành/pause
    private ApprovalStatus approvalStatus;
    private HotelStatusType status;
    private String adminNote; // Lý do từ chối / yêu cầu chỉnh sửa

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