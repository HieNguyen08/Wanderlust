package com.wanderlust.api.dto.reviewComment;

import com.wanderlust.api.entity.types.ReviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCommentAdminUpdateDTO {
    
    @NotNull(message = "Trạng thái duyệt là bắt buộc")
    private ReviewStatus status; // APPROVED, REJECTED, HIDDEN
}