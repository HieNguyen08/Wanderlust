package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.dto.HotelDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelMapper {
    Hotel toEntity(HotelDTO hotelDTO);
    HotelDTO toDTO(Hotel hotel);
    
}
