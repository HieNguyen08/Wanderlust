package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SeatType {
    WINDOW, // Ghế gần cửa sổ
    MIDDLE, // Ghế giữa
    AISLE;  // Ghế gần lối đi

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static SeatType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return SeatType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}