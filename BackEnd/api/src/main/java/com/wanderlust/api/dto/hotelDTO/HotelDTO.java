package com.wanderlust.api.dto.hotelDTO;

import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.types.HotelStatusType;
import com.wanderlust.api.entity.types.HotelType;
import lombok.Data;
import java.math.BigDecimal;

import java.util.List;

@Data
public class HotelDTO {
    private String id;
    private String vendorId;
    private String locationId;
    private String name;
    private String slug;
    private HotelType hotelType;
    private Integer starRating;
    private String address;
    private String description;
    private String phone;
    private String email;
    private String website;

    private List<Hotel.HotelImage> images;
    private List<String> amenities;
    private Hotel.HotelPolicies policies;
    private Boolean featured;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private BigDecimal lowestPrice;
}