package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ActivityDifficulty;
import com.wanderlust.api.entity.Activity.ActivityImage;
import com.wanderlust.api.entity.Activity.ScheduleItem;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ActivityRequestDTO {
    private String locationId;
    private String name;
    private ActivityCategory category;
    private String type;
    private String description;
    
    private List<String> highlights;
    private List<String> included;
    private List<String> notIncluded;
    
    private String duration;
    private Integer minParticipants;
    private Integer maxParticipants;
    
    private ActivityDifficulty difficulty;
    private String ageRestriction;
    private List<String> languages;
    private String meetingPoint;
    
    private List<ActivityImage> images;
    
    private BigDecimal price;
    private BigDecimal originalPrice;
    
    private String cancellationPolicy;
    private List<ScheduleItem> schedule;
}