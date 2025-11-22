package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AdType {
    BANNER,
    POPUP,
    FEATURED,
    SPONSORED;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static AdType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return AdType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}