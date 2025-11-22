package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionType {
    CREDIT,      // Nạp tiền vào ví
    DEBIT,       // Thanh toán từ ví
    REFUND,      // Hoàn tiền (từ vendor hoặc admin)
    WITHDRAW;    // Rút tiền từ ví

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static TransactionType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return TransactionType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}