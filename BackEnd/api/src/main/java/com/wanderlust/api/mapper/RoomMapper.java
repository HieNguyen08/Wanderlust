package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Room;
import com.wanderlust.api.dto.RoomDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room toEntity(RoomDTO roomDTO);
    RoomDTO toDTO(Room room);
}
