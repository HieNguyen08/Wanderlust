package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CabinClass {
    ECONOMY,
    BUSINESS,
    FIRST;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static CabinClass fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return CabinClass.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}