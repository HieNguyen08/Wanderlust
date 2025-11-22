package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoomStatusType {
    ACTIVE,
    INACTIVE;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static RoomStatusType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return RoomStatusType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
