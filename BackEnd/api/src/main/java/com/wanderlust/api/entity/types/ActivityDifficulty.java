package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActivityDifficulty {
    EASY,
    MODERATE,
    HARD;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ActivityDifficulty fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return ActivityDifficulty.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}