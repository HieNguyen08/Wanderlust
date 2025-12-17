package com.wanderlust.api.dto.reviewComment;

import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.TravelType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCommentDTO {

    private String id;
    private String userId;
    // TODO: Thêm UserInfoDTO (gồm tên, avatar) để hiển thị

    private String bookingId;
    private ReviewTargetType targetType;
    private String targetId;

    private Double rating;
    private String title;
    private String comment;
    private Map<String, Integer> detailedRatings;
    private List<ReviewImageDTO> images;

    private LocalDate travelDate;
    private TravelType travelType;

    private ReviewStatus status;
    private Integer helpfulCount;
    private Integer notHelpfulCount;

    private String vendorResponse;
    private LocalDateTime vendorRespondedAt;

    private Boolean verified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // User info for display
    private String userFullName;
    private String userAvatar;
    private String userCity;

    // Flight metadata (optional)
    private String flightNumber;
    private String airlineCode;
    private String airlineName;
    private String airlineLogo;

    // Admin display
    private String targetName;

    // Inner DTO cho Image
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewImageDTO {
        private String url;
        private String caption;
    }
}