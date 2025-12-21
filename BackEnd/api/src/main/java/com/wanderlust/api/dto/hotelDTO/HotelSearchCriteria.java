package com.wanderlust.api.dto.hotelDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.wanderlust.api.entity.types.HotelType;

import lombok.Data;

@Data
public class HotelSearchCriteria {
    private String location; // Có thể là tên thành phố hoặc locationId
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer guests;

    // Bộ lọc nâng cao
    private Integer minStar; // Hạng sao tối thiểu
    private Integer maxStar; // Hạng sao tối đa
    private BigDecimal minPrice; // Giá tối thiểu
    private BigDecimal maxPrice; // Giá tối đa
    private List<String> amenities; // Danh sách tiện ích (VD: ["WiFi", "Pool", "Parking"])
    private HotelType hotelType; // Loại khách sạn (HOTEL, RESORT, HOSTEL, etc.)
    private BigDecimal minRating; // Đánh giá tối thiểu (VD: 4.0)
    private Boolean featuredOnly; // Chỉ lấy khách sạn nổi bật
    private Boolean verifiedOnly; // Chỉ lấy khách sạn đã xác minh
}