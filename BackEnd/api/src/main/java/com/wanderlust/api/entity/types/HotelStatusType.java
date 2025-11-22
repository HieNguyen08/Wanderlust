package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum HotelStatusType {
    ACTIVE,
    INACTIVE,
    PENDING;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static HotelStatusType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return HotelStatusType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
