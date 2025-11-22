package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AdPosition {
    HOME_HERO,      // Banner chính trang chủ
    HOME_SIDEBAR,   // Cột bên trang chủ
    SEARCH_TOP,     // Đầu trang tìm kiếm
    SEARCH_SIDEBAR; // Cột bên trang tìm kiếm

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static AdPosition fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return AdPosition.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}