package com.wanderlust.api.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchResultDTO {
    private String id;
    private String type; // HOTEL, ACTIVITY, TRAVEL_GUIDE, VISA_ARTICLE
    private String title;
    private String description;
    private String imageUrl;
    private Double price;
    private String url; // Frontend route
}
