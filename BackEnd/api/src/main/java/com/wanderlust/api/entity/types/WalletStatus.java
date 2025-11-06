package com.wanderlust.api.entity.types;

public enum WalletStatus {
    ACTIVE,      // Ví đang hoạt động bình thường
    SUSPENDED,   // Ví bị tạm khóa (do vi phạm)
    CLOSED       // Ví đã đóng (user xóa tài khoản)
}
