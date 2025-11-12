package com.wanderlust.api.dto;

import lombok.Data;

@Data
public class NotificationSettingsDTO {
    // Ví dụ về các cài đặt
    private boolean pushNotifications;         // Thông báo đẩy
    private boolean emailNotifications;        // Thông báo qua email
    private boolean promotions;                // Về khuyến mãi
    private boolean bookingUpdates;            // Cập nhật trạng thái đặt chỗ
    private boolean newMessages;               // Tin nhắn mới
}
