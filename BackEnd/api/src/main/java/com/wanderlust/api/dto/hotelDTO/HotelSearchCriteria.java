package com.wanderlust.api.dto.hotelDTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HotelSearchCriteria {
    private String location; // Có thể là tên thành phố hoặc locationId
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer guests;
    private Integer minStar;
    private Integer maxPrice;
}