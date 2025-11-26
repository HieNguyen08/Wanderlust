package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wanderlust.api.entity.types.RefundStatus;

@Document(collection = "refund")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Refund {
    @Id
    private String id;

    private String bookingId; // Liên kết với Booking
    private String userId; // Người yêu cầu hoàn tiền
    private String reason; // Lý do yêu cầu hoàn tiền
    private BigDecimal amount; // Số tiền hoàn lại
    private RefundStatus status; // PENDING, APPROVED, REJECTED

    private String adminResponse; // Phản hồi từ admin
    private String processedBy; // Admin ID xử lý
    private LocalDateTime processedAt; // Thời gian xử lý

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
