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

// Import toàn bộ các Enum vừa tạo
import com.wanderlust.api.entity.types.AdType;
import com.wanderlust.api.entity.types.AdPosition;
import com.wanderlust.api.entity.types.AdTargetType;
import com.wanderlust.api.entity.types.BudgetType;
import com.wanderlust.api.entity.types.AdStatus;

@Document(collection = "advertisement")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Advertisement {
    @Id
    private String id; // Sửa ad_ID -> id

    private String vendorId; // Người đặt quảng cáo

    // --- Content ---
    private String title;
    private String description;

    // --- Type & Position ---
    private AdType type; // Enum
    private AdPosition position; // Enum

    // --- Target (Quảng cáo dẫn đến đâu?) ---
    private AdTargetType targetType; // Enum: HOTEL, EXTERNAL...
    private String targetId;  // ID của Hotel/Flight (Optional)
    private String targetUrl; // URL nếu là External link (Optional)

    // --- Media (URLs) ---
    private String desktopImage;
    private String mobileImage;
    private String video; // Optional

    // --- Display Schedule ---
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer priority; // Độ ưu tiên hiển thị (số càng lớn càng ưu tiên)

    // --- Targeting (JSON Arrays) ---
    private List<String> locations;    // VD: ["SGN", "HAN"]
    private List<String> userSegments; // VD: ["new", "premium"]

    // --- Budget (BigDecimal) ---
    private BigDecimal budget;
    private BudgetType budgetType; // Enum: DAILY, TOTAL
    
    private BigDecimal costPerClick;      // CPC
    private BigDecimal costPerImpression; // CPM

    // --- Performance Stats ---
    private Integer impressions; // Số lượt hiển thị
    private Integer clicks;      // Số lượt click
    private Integer conversions; // Số lượt chuyển đổi thành đơn hàng
    private BigDecimal spend;    // Tổng tiền đã tiêu

    // --- Status ---
    private AdStatus status; // Enum

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}