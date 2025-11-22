package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReviewStatus {
    PENDING,    // Chờ duyệt
    APPROVED,   // Đã duyệt/Hiển thị
    REJECTED,   // Từ chối
    HIDDEN;     // Bị ẩn

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ReviewStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return ReviewStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}