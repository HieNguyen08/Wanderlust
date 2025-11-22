package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentMethod {
    CREDIT_CARD,
    BANK_TRANSFER,
    WALLET,
    MOMO,
    ZALOPAY;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static PaymentMethod fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return PaymentMethod.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}