package com.wanderlust.api.dto;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ActivityDifficulty;
import jakarta.validation.constraints.NotBlank; // Thêm validation nếu cần
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ActivityRequestDTO {

    @NotBlank
    private String name;

    @NotNull
    private String locationId;

    @NotNull
    private ActivityCategory category;

    private String type;
    private String description;

    private List<String> highlights;
    private List<String> included;
    private List<String> notIncluded;
    private String duration;

    @Positive
    private Integer minParticipants;
    
    @Positive
    private Integer maxParticipants;

    private ActivityDifficulty difficulty;
    private String ageRestriction;
    private List<String> languages;
    private String meetingPoint;

    private List<Activity.ActivityImage> images;

    @NotNull
    @Positive
    private BigDecimal price;
    
    private BigDecimal originalPrice;
    private String cancellationPolicy;
    private List<Activity.ScheduleItem> schedule;
    private Boolean featured;
    
}