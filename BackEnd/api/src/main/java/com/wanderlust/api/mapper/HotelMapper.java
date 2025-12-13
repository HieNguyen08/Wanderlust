package com.wanderlust.api.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.entity.Hotel;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface HotelMapper {

    /**
     * Convert Entity -> DTO
     * Map các trường có tên khác nhau từ Entity sang DTO
     */
    @Mapping(source = "hotelID", target = "id")
    HotelDTO toDTO(Hotel hotel);

    /**
     * Convert List Entity -> List DTO
     */
    List<HotelDTO> toDTOs(List<Hotel> hotels);

    /**
     * Convert DTO -> Entity (Dùng cho Create)
     * Bỏ qua ID và các trường Audit khi tạo mới
     * Map ngược lại các trường tên khác nhau
     */
    @Mapping(target = "hotelID", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "latitude", ignore = true)
    @Mapping(target = "longitude", ignore = true)
    @Mapping(target = "shortDescription", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "totalRooms", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "country", ignore = true)
    Hotel toEntity(HotelDTO dto);

    /**
     * Update Entity từ DTO (Dùng cho Update)
     * Chỉ update các trường có dữ liệu (nhờ nullValuePropertyMappingStrategy =
     * IGNORE)
     */
    @Mapping(target = "hotelID", ignore = true) // Không cho phép update ID
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "latitude", ignore = true)
    @Mapping(target = "longitude", ignore = true)
    @Mapping(target = "shortDescription", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "totalRooms", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "country", ignore = true)
    void updateEntityFromDTO(HotelDTO dto, @MappingTarget Hotel hotel);
}