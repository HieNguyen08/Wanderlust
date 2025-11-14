package com.wanderlust.api.dto.reviewComment;

import com.wanderlust.api.entity.types.TravelType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// DTO này cho phép User cập nhật các trường nội dung review
@Data
public class ReviewCommentUpdateDTO {
    
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
        private String url;
        private String caption;
    }
}