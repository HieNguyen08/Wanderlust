package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionStatus {
    PENDING,     // Đang xử lý (VD: refund chờ admin duyệt)
    COMPLETED,   // Hoàn tất
    FAILED;      // Thất bại

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static TransactionStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return TransactionStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
