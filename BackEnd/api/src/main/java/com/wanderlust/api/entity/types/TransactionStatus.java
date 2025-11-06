package com.wanderlust.api.entity.types;



public enum TransactionStatus {
    PENDING,     // Đang xử lý (VD: refund chờ admin duyệt)
    COMPLETED,   // Hoàn tất
    FAILED       // Thất bại
}
