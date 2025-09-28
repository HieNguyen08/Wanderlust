package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Location;
import com.wanderlust.api.dto.LocationDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    Location toEntity(LocationDTO locationDTO);
    LocationDTO toDTO(Location location);
}
