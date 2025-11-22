package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AdTargetType {
    HOTEL,
    FLIGHT,
    CAR,
    ACTIVITY,
    PROMOTION, // Trang khuyến mãi chung
    EXTERNAL;  // Link ra ngoài website

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static AdTargetType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return AdTargetType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}