package com.wanderlust.api.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

// Import các Enum
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.TravelType;
import com.wanderlust.api.entity.types.ReviewStatus;

@Document(collection = "review_comment")
@CompoundIndexes({
    // Index để tìm nhanh review theo user hoặc theo đối tượng (hotel/tour...)
    @CompoundIndex(name = "target_idx", def = "{'targetId': 1, 'targetType': 1}"),
    @CompoundIndex(name = "user_booking_idx", def = "{'userId': 1, 'bookingId': 1}")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewComment {
    @Id
    private String id; // Sửa num_of_rating_ID -> id

    private String userId;
    private String bookingId;

    // --- Polymorphic Target ---
    // Thay vì lưu hotel_ID, flight_ID riêng, ta dùng cặp (ID + Type)
    // VD: targetType="HOTEL", targetId="123-abc"
    private ReviewTargetType targetType; 
    private String targetId;

    // --- Main Content ---
    private Double rating; // 1.0 - 5.0 (Dùng Double cho rating là đủ)
    private String title;
    private String comment;

    // --- Detailed Ratings (JSON) ---
    // VD: { "cleanliness": 5, "service": 4, "value": 5 }
    private Map<String, Integer> detailedRatings;

    // --- Media (JSON List) ---
    private List<ReviewImage> images;

    // --- Travel Context ---
    private LocalDate travelDate;
    private TravelType travelType; // Enum

    // --- Moderation ---
    private ReviewStatus status; // Enum
    private String moderatedBy;  // Admin ID
    private LocalDateTime moderatedAt;

    // --- Engagement ---
    private Integer helpfulCount;
    private Integer notHelpfulCount;

    // --- Vendor Response ---
    private String vendorResponse;
    private LocalDateTime vendorRespondedAt;

    // --- Verification ---
    private Boolean verified; // Check xem đúng là user đã book không

    // --- Flight metadata (optional, cho review flight) ---
    private String flightNumber; // VD: "VN123"
    private String airlineCode;  // VD: "VN"
    private String airlineName;  // VD: "Vietnam Airlines"
    private String airlineLogo;  // URL logo hãng bay

    // --- Voting ---
    // removed duplicate notHelpfulCount field

    // --- Audit ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ==========================================
    // INNER CLASSES
    // ==========================================

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewImage {
        private String url;
        private String caption;
    }
}