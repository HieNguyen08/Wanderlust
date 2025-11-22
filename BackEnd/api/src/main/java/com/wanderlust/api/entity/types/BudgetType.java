package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BudgetType {
    DAILY, // Ngân sách theo ngày
    TOTAL; // Tổng ngân sách chiến dịch

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static BudgetType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return BudgetType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}