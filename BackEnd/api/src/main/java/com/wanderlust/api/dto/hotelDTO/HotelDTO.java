package com.wanderlust.api.dto.hotelDTO;

import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.types.HotelType;
import com.wanderlust.api.entity.types.HotelStatusType;
import com.wanderlust.api.entity.types.ApprovalStatus;
import lombok.Data;
import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class HotelDTO {
    private String id;
    private String vendorId;
    private String locationId;
    private String name;
    private String slug;
    private HotelType hotelType;
    private ApprovalStatus approvalStatus;
    private HotelStatusType status;
    private String adminNote;
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
    private Boolean verified;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private BigDecimal lowestPrice;
    private Integer totalRooms;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RoomDTO> rooms;
}