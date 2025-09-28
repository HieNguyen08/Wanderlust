package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.UserDTO;
import com.wanderlust.api.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);
}