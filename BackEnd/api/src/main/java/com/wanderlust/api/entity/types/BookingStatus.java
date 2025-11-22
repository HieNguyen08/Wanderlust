package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BookingStatus {
    PENDING,            // Chờ xử lý
    CONFIRMED,          // Đã xác nhận
    CANCELLED,          // Đã hủy
    COMPLETED,          // Đã hoàn thành
    REFUND_REQUESTED;   // Yêu cầu hoàn tiền

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static BookingStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return BookingStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}