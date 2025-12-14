package com.wanderlust.api.entity.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Shared approval state for services submitted by vendors.
 */
public enum ApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ApprovalStatus fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return ApprovalStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
