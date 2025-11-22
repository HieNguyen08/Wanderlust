package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SeatStatus {
    AVAILABLE, // Có sẵn
    RESERVED,  // Đang giữ chỗ
    OCCUPIED;  // Đã bán/có người ngồi

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static SeatStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return SeatStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}