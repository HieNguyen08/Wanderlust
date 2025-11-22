package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FuelPolicy {
    FULL_TO_FULL, // Nhận đầy bình, trả đầy bình
    SAME_TO_SAME; // Nhận sao trả vậy

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static FuelPolicy fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return FuelPolicy.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}