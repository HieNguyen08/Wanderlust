package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActivityStatus {
    ACTIVE,
    INACTIVE,
    SOLDOUT;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ActivityStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return ActivityStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}