package com.wanderlust.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@CompoundIndexes({
    @CompoundIndex(name = "user_notifications_idx", 
                   def = "{'userId': 1, 'createdAt': -1}"),
    @CompoundIndex(name = "unread_count_idx", 
                   def = "{'userId': 1, 'isRead': 1}")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;

    private String userId;
    private String title;
    private String message;
    private String type; // SYSTEM, PROMOTION, BOOKING
    private boolean isRead;

    private LocalDateTime createdAt;
}
