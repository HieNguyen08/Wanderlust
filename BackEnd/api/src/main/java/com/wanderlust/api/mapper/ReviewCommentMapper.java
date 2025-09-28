package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.dto.ReviewCommentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewCommentMapper {
    ReviewComment toEntity(ReviewCommentDTO reviewCommentDTO);
    ReviewCommentDTO toDTO(ReviewComment reviewComment);
}
