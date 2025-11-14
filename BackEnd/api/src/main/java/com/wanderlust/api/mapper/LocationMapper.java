package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.locationDTO.LocationRequestDTO;
import com.wanderlust.api.dto.locationDTO.LocationResponseDTO;
import com.wanderlust.api.entity.Location;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

// componentModel = "spring" giúp bạn có thể @Autowired mapper này vào Service
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LocationMapper {

    LocationMapper INSTANCE = Mappers.getMapper(LocationMapper.class);

    /**
     * Convert Entity -> Response DTO
     * Các trường tên giống nhau sẽ tự động map.
     */
    LocationResponseDTO toDTO(Location location);

    /**
     * Convert List Entity -> List Response DTO
     */
    List<LocationResponseDTO> toDTOs(List<Location> locations);

    /**
     * Convert Request DTO -> Entity (Dùng cho Create)
     * Bỏ qua id, createdAt, updatedAt vì các trường này do DB/System tạo
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Location toEntity(LocationRequestDTO dto);

    /**
     * Update Entity từ Request DTO (Dùng cho Update)
     * @MappingTarget: báo cho MapStruct biết đây là object cần update
     * nullValuePropertyMappingStrategy = IGNORE (ở header) sẽ đảm bảo chỉ update các trường có dữ liệu
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(LocationRequestDTO dto, @MappingTarget Location location);
}