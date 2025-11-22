package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AdStatus {
    DRAFT,      // Nháp
    ACTIVE,     // Đang chạy
    PAUSED,     // Tạm dừng
    COMPLETED,  // Đã xong
    REJECTED;   // Bị từ chối duyệt

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static AdStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return AdStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}