package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoomType {
    SINGLE,
    DOUBLE,
    SUITE,
    FAMILY;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static RoomType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return RoomType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
