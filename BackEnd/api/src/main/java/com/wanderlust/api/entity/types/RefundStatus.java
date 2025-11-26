package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RefundStatus {
    PENDING, // Đang chờ xử lý
    APPROVED, // Đã duyệt
    REJECTED; // Từ chối

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static RefundStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return RefundStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
