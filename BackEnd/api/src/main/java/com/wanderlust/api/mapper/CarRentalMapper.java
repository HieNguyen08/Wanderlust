package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.carRental.CarRentalDTO;
import com.wanderlust.api.entity.CarRental;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CarRentalMapper {

    /**
     * Convert Entity -> DTO
     */
    CarRentalDTO toDTO(CarRental carRental);

    /**
     * Convert List Entity -> List DTO
     */
    List<CarRentalDTO> toDTOs(List<CarRental> carRentals);

    /**
     * Convert DTO -> Entity (Create)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "averageRating", constant = "0.0")
    @Mapping(target = "totalReviews", constant = "0")
    @Mapping(target = "totalTrips", constant = "0")
    CarRental toEntity(CarRentalDTO dto);

    /**
     * Update Entity from DTO (Update)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vendorId", ignore = true) // Không cho phép đổi vendor khi update thông tin xe
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(CarRentalDTO dto, @MappingTarget CarRental carRental);
}