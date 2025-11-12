package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.NotificationSettingsDTO;
import com.wanderlust.api.entity.NotificationSettings;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationSettingsMapper {
    NotificationSettingsMapper INSTANCE = Mappers.getMapper(NotificationSettingsMapper.class);

    NotificationSettingsDTO toDTO(NotificationSettings entity);
    
    NotificationSettings toEntity(NotificationSettingsDTO dto);
    
    void updateEntityFromDto(NotificationSettingsDTO dto, @MappingTarget NotificationSettings entity);
}