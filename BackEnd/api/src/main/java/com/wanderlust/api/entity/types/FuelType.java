package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FuelType {
    PETROL,     // Xăng
    GASOLINE,   // Xăng (alternative name)
    DIESEL,     // Dầu
    ELECTRIC,   // Điện
    HYBRID;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static FuelType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return FuelType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}