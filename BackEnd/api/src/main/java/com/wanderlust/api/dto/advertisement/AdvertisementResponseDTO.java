package com.wanderlust.api.dto.advertisement;

import com.wanderlust.api.entity.types.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdvertisementResponseDTO {

    private String id; // ID của quảng cáo
    private String vendorId;
    private String title;
    private String description;

    private AdType type;
    private AdPosition position;

    private AdTargetType targetType;
    private String targetId;
    private String targetUrl;

    private String desktopImage;
    private String mobileImage;
    private String video;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer priority;

    private List<String> locations;
    private List<String> userSegments;

    private BigDecimal budget;
    private BudgetType budgetType;
    private BigDecimal costPerClick;
    private BigDecimal costPerImpression;

    // Performance Stats
    private Integer impressions;
    private Integer clicks;
    private Integer conversions;
    private BigDecimal spend;

    private AdStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}