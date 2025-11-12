package com.wanderlust.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationSettings {
    
    private boolean pushNotifications = true;
    private boolean emailNotifications = true;
    private boolean promotions = true;
    private boolean bookingUpdates = true;
    private boolean newMessages = true;
}