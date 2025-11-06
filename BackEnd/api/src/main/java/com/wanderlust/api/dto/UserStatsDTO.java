package com.wanderlust.api.dto;

import lombok.Data;

@Data
public class UserStatsDTO {
    private Integer totalTrips;
    private Integer loyaltyPoints;
    private Integer totalReviews;
}