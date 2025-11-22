package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReviewTargetType {
    HOTEL,
    FLIGHT,
    CAR,
    ACTIVITY;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ReviewTargetType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return ReviewTargetType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}