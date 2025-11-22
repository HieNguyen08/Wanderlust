package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActivityCategory {
    TOUR,
    ADVENTURE,
    CULTURE,
    FOOD,
    ENTERTAINMENT,
    RELAXATION,
    ATTRACTION;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ActivityCategory fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return ActivityCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}