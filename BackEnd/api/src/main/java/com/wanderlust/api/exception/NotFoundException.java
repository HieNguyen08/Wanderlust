package com.wanderlust.api.exception;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class NotFoundException extends RuntimeException {

    private final String message;

    public String getMessage() {
        return this.message;
    }
}