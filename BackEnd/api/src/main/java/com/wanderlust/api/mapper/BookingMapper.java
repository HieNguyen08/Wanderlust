package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.entity.Booking;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingMapper {

    /**
     * Convert Entity -> DTO
     */
    BookingDTO toDTO(Booking booking);

    /**
     * Convert List Entity -> List DTO
     */
    List<BookingDTO> toDTOs(List<Booking> bookings);

    /**
     * Convert DTO -> Entity (Create)
     * Ignore ID, bookingCode (tự sinh), và Audit fields
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true) // Service sẽ tự sinh code
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Booking toEntity(BookingDTO dto);

    /**
     * Update Entity từ DTO
     * Chỉ update các trường có dữ liệu (non-null)
     * Không cho phép update ID, BookingCode, và thông tin Audit tại đây
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(BookingDTO dto, @MappingTarget Booking booking);
}