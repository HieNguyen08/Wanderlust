package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.dto.BookingDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    Booking toEntity(BookingDTO bookingDTO);
    BookingDTO toDTO(Booking booking);
}
