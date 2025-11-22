package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TransmissionType {
    AUTOMATIC, // Số tự động
    MANUAL;    // Số sàn

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static TransmissionType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return TransmissionType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}