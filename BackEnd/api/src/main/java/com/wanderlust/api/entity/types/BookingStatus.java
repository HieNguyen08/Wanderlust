package com.wanderlust.api.entity.types;

public enum BookingStatus {
    PENDING,            // Chờ xử lý
    CONFIRMED,          // Đã xác nhận
    CANCELLED,          // Đã hủy
    COMPLETED,          // Đã hoàn thành
    REFUND_REQUESTED    // Yêu cầu hoàn tiền
}