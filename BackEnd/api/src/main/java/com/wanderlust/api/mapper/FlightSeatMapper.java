package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.FlightSeat;
import com.wanderlust.api.dto.FlightSeatDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FlightSeatMapper {
    FlightSeat toEntity(FlightSeatDTO flightSeatDTO);
    FlightSeatDTO toDTO(FlightSeat flightSeat);
}
