package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CancellationPolicyType {
    FLEXIBLE,
    MODERATE,
    STRICT;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static CancellationPolicyType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return CancellationPolicyType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
