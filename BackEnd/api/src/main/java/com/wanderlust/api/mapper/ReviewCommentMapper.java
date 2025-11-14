package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.reviewComment.ReviewCommentAdminUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentCreateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentVendorResponseDTO;
import com.wanderlust.api.entity.ReviewComment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewCommentMapper {

    /**
     * Convert Entity -> DTO
     */
    ReviewCommentDTO toDTO(ReviewComment reviewComment);

    /**
     * Convert List Entity -> List DTO
     */
    List<ReviewCommentDTO> toDTOs(List<ReviewComment> reviewComments);

    /**
     * Convert CreateDTO -> Entity (Dùng cho Create)
     * Bỏ qua ID và các trường được quản lý (status, helpfulCount, vendorResponse...)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true) // Sẽ được set ở Service
    @Mapping(target = "status", ignore = true) // Sẽ được set là PENDING ở Service
    @Mapping(target = "moderatedBy", ignore = true)
    @Mapping(target = "moderatedAt", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "notHelpfulCount", ignore = true)
    @Mapping(target = "vendorResponse", ignore = true)
    @Mapping(target = "vendorRespondedAt", ignore = true)
    @Mapping(target = "verified", ignore = true) // Sẽ được set ở Service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ReviewComment toEntity(ReviewCommentCreateDTO createDTO);

    /**
     * Update Entity từ User UpdateDTO (Dùng cho User Update)
     * Chỉ update các trường nội dung
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "targetType", ignore = true)
    @Mapping(target = "targetId", ignore = true)
    @Mapping(target = "status", ignore = true) // Sẽ được set là PENDING ở Service
    @Mapping(target = "moderatedBy", ignore = true)
    @Mapping(target = "moderatedAt", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "notHelpfulCount", ignore = true)
    @Mapping(target = "vendorResponse", ignore = true)
    @Mapping(target = "vendorRespondedAt", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true) // Sẽ được set ở Service
    void updateEntityFromUserDTO(ReviewCommentUpdateDTO updateDTO, @MappingTarget ReviewComment reviewComment);

    /**
     * Update Entity từ Admin UpdateDTO (Dùng cho Admin Moderate)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "targetType", ignore = true)
    @Mapping(target = "targetId", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "comment", ignore = true)
    @Mapping(target = "detailedRatings", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "travelDate", ignore = true)
    @Mapping(target = "travelType", ignore = true)
    @Mapping(target = "moderatedBy", ignore = true) // Sẽ được set ở Service
    @Mapping(target = "moderatedAt", ignore = true) // Sẽ được set ở Service
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "notHelpfulCount", ignore = true)
    @Mapping(target = "vendorResponse", ignore = true)
    @Mapping(target = "vendorRespondedAt", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true) // Sẽ được set ở Service
    void updateEntityFromAdminDTO(ReviewCommentAdminUpdateDTO adminUpdateDTO, @MappingTarget ReviewComment reviewComment);

     /**
     * Update Entity từ Vendor ResponseDTO (Dùng cho Partner Response)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "targetType", ignore = true)
    @Mapping(target = "targetId", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "comment", ignore = true)
    @Mapping(target = "detailedRatings", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "travelDate", ignore = true)
    @Mapping(target = "travelType", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "moderatedBy", ignore = true)
    @Mapping(target = "moderatedAt", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "notHelpfulCount", ignore = true)
    @Mapping(target = "vendorRespondedAt", ignore = true) // Sẽ được set ở Service
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromVendorDTO(ReviewCommentVendorResponseDTO vendorResponseDTO, @MappingTarget ReviewComment reviewComment);
}