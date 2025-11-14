package com.wanderlust.api.dto.advertisement;

import com.wanderlust.api.entity.types.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// javax.validation.constraints.* // Bạn nên thêm dependency 'spring-boot-starter-validation' 
// và thêm các annotation như @NotBlank, @NotNull, @FutureOrPresent

@Data
public class AdvertisementRequestDTO {

    private String vendorId; // Sẽ được set từ user đang login (PARTNER) hoặc admin
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
    
    private AdStatus status; // Admin hoặc Vendor có thể set (DRAFT, PAUSED, ACTIVE)
}