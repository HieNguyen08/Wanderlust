package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BookingType {
    FLIGHT,
    HOTEL,
    CAR_RENTAL,
    ACTIVITY;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static BookingType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return BookingType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}