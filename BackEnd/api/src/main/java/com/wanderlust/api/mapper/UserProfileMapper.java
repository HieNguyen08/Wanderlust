package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.UserProfileResponseDTO;
import com.wanderlust.api.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileMapper INSTANCE = Mappers.getMapper(UserProfileMapper.class);

    // MapStruct sẽ tự động map các trường có tên giống nhau
    UserProfileResponseDTO toUserProfileResponseDTO(User user);
}