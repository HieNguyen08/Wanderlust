package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentStatus {
    PENDING,    // Đang chờ
    PROCESSING, // Đang xử lý (VD: đang gọi qua cổng thanh toán)
    COMPLETED,  // Thành công (Tương đương Paid)
    FAILED,     // Thất bại
    REFUNDED;   // Đã hoàn tiền

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static PaymentStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return PaymentStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}