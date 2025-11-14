package com.wanderlust.api.dto.locationDTO;

import com.wanderlust.api.entity.types.LocationType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class LocationRequestDTO {
    private String name;
    private String slug;
    private LocationType type;
    private String parentLocationId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String timezone;
    private String description;
    private String image;
    private Boolean featured;
    private Integer popularity;
    private Map<String, Object> metadata;
}