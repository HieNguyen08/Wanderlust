package com.wanderlust.api.entity.types;

public enum PaymentStatus {
    PENDING,    // Đang chờ
    PROCESSING, // Đang xử lý (VD: đang gọi qua cổng thanh toán)
    COMPLETED,  // Thành công (Tương đương Paid)
    FAILED,     // Thất bại
    REFUNDED    // Đã hoàn tiền
}