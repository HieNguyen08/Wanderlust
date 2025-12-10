package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum để định nghĩa category của promotion
 * Cho biết promotion áp dụng cho loại dịch vụ nào
 */
public enum PromotionCategory {
    HOTEL,      // Áp dụng cho khách sạn
    FLIGHT,     // Áp dụng cho chuyến bay
    CAR,        // Áp dụng cho thuê xe
    ACTIVITY,   // Áp dụng cho hoạt động
    ALL;        // Áp dụng cho tất cả dịch vụ

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static PromotionCategory fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return PromotionCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
