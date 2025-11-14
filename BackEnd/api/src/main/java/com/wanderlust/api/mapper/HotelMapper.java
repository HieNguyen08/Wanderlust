package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.entity.Hotel;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface HotelMapper {

    /**
     * Convert Entity -> DTO
     * Map các trường có tên khác nhau từ Entity sang DTO
     */
    @Mapping(source = "hotel_ID", target = "id")
    @Mapping(source = "hotel_Type", target = "hotelType")
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
    @Mapping(target = "hotel_ID", ignore = true) 
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "hotelType", target = "hotel_Type")
    Hotel toEntity(HotelDTO dto);

    /**
     * Update Entity từ DTO (Dùng cho Update)
     * Chỉ update các trường có dữ liệu (nhờ nullValuePropertyMappingStrategy = IGNORE)
     */
    @Mapping(target = "hotel_ID", ignore = true) // Không cho phép update ID
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "hotelType", target = "hotel_Type")
    void updateEntityFromDTO(HotelDTO dto, @MappingTarget Hotel hotel);
}