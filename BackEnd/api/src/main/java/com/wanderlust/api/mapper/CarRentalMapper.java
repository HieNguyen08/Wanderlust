package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.dto.CarRentalDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CarRentalMapper {
    CarRental toEntity(CarRentalDTO carRentalDTO);
    CarRentalDTO toDTO(CarRental carRental);
}
