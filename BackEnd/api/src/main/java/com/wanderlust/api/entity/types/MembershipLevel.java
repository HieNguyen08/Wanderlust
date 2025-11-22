package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MembershipLevel {
    BRONZE,
    SILVER,
    GOLD,
    PLATINUM;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static MembershipLevel fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return MembershipLevel.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
