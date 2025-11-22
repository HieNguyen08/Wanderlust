package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TravelType {
    SOLO,
    COUPLE,
    FAMILY,
    FRIENDS,
    BUSINESS;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static TravelType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return TravelType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}