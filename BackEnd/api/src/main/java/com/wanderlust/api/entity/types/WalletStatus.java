package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WalletStatus {
    ACTIVE,      // Ví đang hoạt động bình thường
    SUSPENDED,   // Ví bị tạm khóa (do vi phạm)
    CLOSED;      // Ví đã đóng (user xóa tài khoản)

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static WalletStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return WalletStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
