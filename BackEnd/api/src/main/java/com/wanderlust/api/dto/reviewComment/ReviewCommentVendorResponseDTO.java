package com.wanderlust.api.dto.reviewComment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewCommentVendorResponseDTO {

    @NotBlank(message = "Nội dung phản hồi không được để trống")
    @Size(max = 2000, message = "Phản hồi không quá 2000 ký tự")
    private String vendorResponse;
}