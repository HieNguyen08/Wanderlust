package com.wanderlust.api.dto.reviewComment;

import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.TravelType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class ReviewCommentCreateDTO {

    @NotNull(message = "Booking ID là bắt buộc")
    private String bookingId;

    // Thông thường, 2 trường này nên được suy ra từ bookingId ở service
    // Nhưng chúng ta tạm thời để user gửi lên để đơn giản hóa logic
    @NotNull(message = "Target Type là bắt buộc")
    private ReviewTargetType targetType;
    
    @NotNull(message = "Target ID là bắt buộc")
    private String targetId;

    @NotNull(message = "Rating là bắt buộc")
    @Min(value = 1, message = "Rating phải từ 1 đến 5")
    @Max(value = 5, message = "Rating phải từ 1 đến 5")
    private Double rating;

    @Size(max = 200, message = "Tiêu đề không quá 200 ký tự")
    private String title;

    @Size(max = 5000, message = "Nội dung không quá 5000 ký tự")
    private String comment;

    private Map<String, Integer> detailedRatings;
    private List<ReviewCommentImageCreateDTO> images;

    private LocalDate travelDate;
    private TravelType travelType;

    @Data
    public static class ReviewCommentImageCreateDTO {
        @NotNull
        private String url;
        private String caption;
    }
}