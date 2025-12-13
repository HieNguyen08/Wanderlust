package com.wanderlust.api.mapper;

import java.time.LocalDateTime;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.wanderlust.api.dto.ActivityRequestDTO;
import com.wanderlust.api.entity.Activity;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    imports = {LocalDateTime.class, java.math.BigDecimal.class}
)
public interface ActivityMapper {

    /**
     * Convert DTO -> Entity (Dùng cho Create)
     * - Set các giá trị mặc định (Status, Rating, Time...)
     * - Bỏ qua các trường ID, VendorId, Slug (sẽ set trong Service)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vendorId", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "totalReviews", constant = "0")
    @Mapping(target = "totalBooked", constant = "0")
    @Mapping(target = "featured", constant = "false")
    @Mapping(target = "averageRating", expression = "java(BigDecimal.ZERO)")
    @Mapping(target = "createdAt", expression = "java(LocalDateTime.now())")
    @Mapping(target = "updatedAt", expression = "java(LocalDateTime.now())")
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "country", ignore = true)
    Activity toEntity(ActivityRequestDTO dto);

    /**
     * Update Entity từ DTO (Dùng cho Update)
     * - Chỉ update các trường có dữ liệu (Not Null)
     * - Tự động cập nhật updatedAt
     * - Bỏ qua các trường không được phép sửa qua API này (ID, Owner, Stats...)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vendorId", ignore = true)
    @Mapping(target = "slug", ignore = true) // Slug thường giữ nguyên để giữ SEO, hoặc xử lý riêng
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    @Mapping(target = "totalBooked", ignore = true)
    @Mapping(target = "featured", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(LocalDateTime.now())")
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "country", ignore = true)
    void updateEntityFromDTO(ActivityRequestDTO dto, @MappingTarget Activity activity);
}