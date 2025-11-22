package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CarType {
    SEDAN,
    SUV,
    VAN,
    LUXURY,
    SPORT,
    HATCHBACK,
    ELECTRIC;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static CarType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return CarType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}