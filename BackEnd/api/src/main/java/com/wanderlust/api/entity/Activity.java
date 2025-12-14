package com.wanderlust.api.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

// Import các Enum vừa tạo
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ActivityDifficulty;
import com.wanderlust.api.entity.types.ActivityStatus;
import com.wanderlust.api.entity.types.ApprovalStatus;

@Document(collection = "activity")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    @Id
    private String id;

    private String vendorId; // Thay cho userId cũ
    private String locationId; // FK to Location
    private String city;
    private String country;

    private String name;
    private String slug;

    private ActivityCategory category; // Enum

    private String type; // "City Tour", "Water Sports"
    private String description;

    // --- Lists & JSON ---
    private List<String> highlights; // ["Visit temples", "Local food"]
    private List<String> included; // ["Guide", "Transport"]
    private List<String> notIncluded; // ["Personal expenses"]

    private String duration; // "4 hours", "Full day"

    // Thời gian diễn ra
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer autoCloseBeforeMinutes; // ví dụ 60 phút trước giờ bắt đầu

    // --- Participants ---
    private Integer minParticipants;
    private Integer maxParticipants; // Sửa max_Participants -> camelCase
    private Integer capacityMax; // tổng sức chứa
    private Integer currentBookings; // số booking hiện tại (để auto full)

    private ActivityDifficulty difficulty; // Enum

    private String ageRestriction; // "5+"
    private List<String> languages; // ["English", "Vietnamese"]
    private String meetingPoint;

    // --- Images (JSON Structure) ---
    private List<ActivityImage> images;

    // --- Pricing ---
    private BigDecimal price; // Sửa float -> BigDecimal
    private BigDecimal originalPrice; // Optional

    private String cancellationPolicy;

    // --- Schedule (JSON Structure) ---
    // [{day, activities}]
    private List<ScheduleItem> schedule;

    // --- Status & Stats ---
    private ActivityStatus status; // Enum (operational / auto-closed)
    private ApprovalStatus approvalStatus; // Admin review status
    private String adminNote; // Lý do từ chối / yêu cầu chỉnh sửa
    private Boolean featured;

    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalBooked;

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ==========================================
    // INNER CLASSES (Mapping cho JSON Structures)
    // ==========================================

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ActivityImage {
        private String url;
        private String caption;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ScheduleItem {
        private Integer day; // Ngày thứ mấy (1, 2, 3...)
        private String title; // Tên hoạt động chính trong ngày
        private List<String> activities; // Chi tiết các hoạt động
    }
}