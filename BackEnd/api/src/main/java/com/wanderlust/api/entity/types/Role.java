package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    USER,
    VENDOR,
    ADMIN;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static Role fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Role.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
