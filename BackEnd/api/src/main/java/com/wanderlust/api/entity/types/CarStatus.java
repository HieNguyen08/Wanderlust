package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CarStatus {
    PENDING_REVIEW,
    AVAILABLE,
    RENTED,
    MAINTENANCE,
    PAUSED,
    REJECTED;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static CarStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return CarStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}