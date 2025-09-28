package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Advertisement;
import com.wanderlust.api.dto.AdvertisementDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdvertisementMapper {
    Advertisement toEntity(AdvertisementDTO advertisementDTO);
    AdvertisementDTO toDTO(Advertisement advertisement);
}
