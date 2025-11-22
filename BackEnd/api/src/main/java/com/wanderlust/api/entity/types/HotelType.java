package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum HotelType {
    HOTEL,
    VILLA,
    APARTMENT,
    RESORT,
    HOSTEL,
    MOTEL,
    GUEST_HOUSE;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static HotelType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return HotelType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
