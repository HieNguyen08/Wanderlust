package com.wanderlust.api.mapper;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.dto.FlightDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FlightMapper {
    Flight toEntity(FlightDTO flightDTO);
    FlightDTO toDTO(Flight flight);
}
