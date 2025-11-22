package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FlightStatus {
    SCHEDULED,
    DELAYED,
    CANCELLED,
    COMPLETED;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static FlightStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return FlightStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}