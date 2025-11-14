package com.wanderlust.api.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.entity.Booking;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired; // Thêm import

import java.util.List;
import java.util.Map; // Thêm import

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public abstract class BookingMapper { // <-- THAY ĐỔI: Chuyển thành abstract class

    // Tiêm ObjectMapper để xử lý chuyển đổi Map <-> Object
    @Autowired
    protected ObjectMapper objectMapper;

    /**
     * Convert Entity -> DTO
     * Cần chỉ định phương thức custom cho các trường không khớp
     */
    @Mapping(target = "guestInfo", source = "guestInfo", qualifiedByName = "guestInfoToMap")
    @Mapping(target = "numberOfGuests", source = "numberOfGuests", qualifiedByName = "guestCountToMap")
    public abstract BookingDTO toDTO(Booking booking);

    /**
     * Convert List Entity -> List DTO
     */
    public abstract List<BookingDTO> toDTOs(List<Booking> bookings);

    /**
     * Convert DTO -> Entity (Create)
     * Cần chỉ định phương thức custom cho các trường không khớp
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "guestInfo", source = "guestInfo", qualifiedByName = "mapToGuestInfo")
    @Mapping(target = "numberOfGuests", source = "numberOfGuests", qualifiedByName = "mapToGuestCount")
    public abstract Booking toEntity(BookingDTO dto);

    /**
     * Update Entity từ DTO
     * Cần chỉ định phương thức custom cho các trường không khớp
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "guestInfo", source = "guestInfo", qualifiedByName = "mapToGuestInfo")
    @Mapping(target = "numberOfGuests", source = "numberOfGuests", qualifiedByName = "mapToGuestCount")
    public abstract void updateEntityFromDTO(BookingDTO dto, @MappingTarget Booking booking);

    // =======================================================
    // === CÁC PHƯƠNG THỨC CHUYỂN ĐỔI CUSTOM (MỚI THÊM) ===
    // =======================================================

    /**
     * Chuyển Map (từ DTO) sang object GuestInfo (cho Entity)
     */
    @Named("mapToGuestInfo")
    protected Booking.GuestInfo mapToGuestInfo(Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        // Dùng ObjectMapper chuyển Map (từ JSON) thành object GuestInfo
        return objectMapper.convertValue(map, Booking.GuestInfo.class);
    }

    /**
     * Chuyển Map (từ DTO) sang object GuestCount (cho Entity)
     */
    @Named("mapToGuestCount")
    protected Booking.GuestCount mapToGuestCount(Map<String, Integer> map) {
        if (map == null) {
            return null;
        }
        // Dùng ObjectMapper chuyển Map (từ JSON) thành object GuestCount
        return objectMapper.convertValue(map, Booking.GuestCount.class);
    }

    /**
     * Chuyển object GuestInfo (từ Entity) sang Map (cho DTO)
     */
    @Named("guestInfoToMap")
    protected Map<String, Object> guestInfoToMap(Booking.GuestInfo guestInfo) {
        if (guestInfo == null) {
            return null;
        }
        // Dùng ObjectMapper chuyển object GuestInfo thành Map<String, Object>
        return objectMapper.convertValue(guestInfo, new TypeReference<Map<String, Object>>() {});
    }

    /**
     * Chuyển object GuestCount (từ Entity) sang Map (cho DTO)
     */
    @Named("guestCountToMap")
    protected Map<String, Integer> guestCountToMap(Booking.GuestCount guestCount) {
        if (guestCount == null) {
            return null;
        }
        // Dùng ObjectMapper chuyển object GuestCount thành Map<String, Integer>
        return objectMapper.convertValue(guestCount, new TypeReference<Map<String, Integer>>() {});
    }
}