package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.advertisement.AdvertisementRequestDTO;
import com.wanderlust.api.dto.advertisement.AdvertisementResponseDTO;
import com.wanderlust.api.entity.Advertisement;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AdvertisementMapper {

    /**
     * Convert Entity -> ResponseDTO
     */
    AdvertisementResponseDTO toDTO(Advertisement advertisement);

    /**
     * Convert List Entity -> List ResponseDTO
     */
    List<AdvertisementResponseDTO> toDTOs(List<Advertisement> advertisements);

    /**
     * Convert RequestDTO -> Entity (Dùng cho Create)
     * Bỏ qua ID và các trường Audit/Stats khi tạo mới
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "impressions", ignore = true)
    @Mapping(target = "clicks", ignore = true)
    @Mapping(target = "conversions", ignore = true)
    @Mapping(target = "spend", ignore = true)
    Advertisement toEntity(AdvertisementRequestDTO dto);

    /**
     * Update Entity từ RequestDTO (Dùng cho Update)
     * Chỉ update các trường có dữ liệu (nhờ nullValuePropertyMappingStrategy = IGNORE)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "impressions", ignore = true)
    @Mapping(target = "clicks", ignore = true)
    @Mapping(target = "conversions", ignore = true)
    @Mapping(target = "spend", ignore = true)
    void updateEntityFromDTO(AdvertisementRequestDTO dto, @MappingTarget Advertisement advertisement);
}