package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.ActivityDTO;
import com.wanderlust.api.entity.Activity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    ActivityDTO toDTO(Activity activity);
    Activity toEntity(ActivityDTO activityDTO);
}