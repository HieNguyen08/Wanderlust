package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.dto.PromotionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    Promotion toEntity(PromotionDTO promotionDTO);
    PromotionDTO toDTO(Promotion promotion);
}
