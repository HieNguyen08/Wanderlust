package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum LocationType {
    CITY,
    CONTRY,
    REGION;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static LocationType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return LocationType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
