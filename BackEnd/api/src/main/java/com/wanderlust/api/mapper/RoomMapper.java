package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Room;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoomMapper {

    /**
     * Convert Entity -> DTO
     */
    RoomDTO toDTO(Room room);

    /**
     * Convert List Entity -> List DTO
     */
    List<RoomDTO> toDTOs(List<Room> rooms);

    /**
     * Convert DTO -> Entity (Dùng cho Create)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "refundable", ignore = true)
    Room toEntity(RoomDTO dto);

    /**
     * Update Entity từ DTO (Dùng cho Update)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "refundable", ignore = true)
    void updateEntityFromDTO(RoomDTO dto, @MappingTarget Room room);
}