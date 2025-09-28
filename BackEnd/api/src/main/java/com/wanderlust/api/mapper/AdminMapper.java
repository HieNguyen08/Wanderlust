package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Admin;
import com.wanderlust.api.dto.AdminDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    Admin toEntity(AdminDTO admindDTO);
    AdminDTO toDTO(Admin admin);
}
