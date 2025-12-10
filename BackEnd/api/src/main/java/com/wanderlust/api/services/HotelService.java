package com.wanderlust.api.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.dto.hotelDTO.HotelSearchCriteria;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.mapper.HotelMapper;
import com.wanderlust.api.mapper.RoomMapper;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RoomRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final HotelMapper hotelMapper;
    private final RoomMapper roomMapper;
    private final com.wanderlust.api.repository.LocationRepository locationRepository;

    // 1. Search Hotels (Location, filters)
    public List<HotelDTO> searchHotels(HotelSearchCriteria criteria) {
        List<Hotel> hotels;

        // Bước 1: Lọc theo location
        if (criteria.getLocation() != null && !criteria.getLocation().isEmpty()) {
            // Kiểm tra xem location có phải là locationId không
            if (criteria.getLocation().startsWith("location_")) {
                hotels = hotelRepository.findByLocationId(criteria.getLocation());
            } else {
                // Tìm theo keyword (tên hoặc địa chỉ)
                hotels = hotelRepository.searchBasic(criteria.getLocation());
            }
        } else {
            hotels = hotelRepository.findAll();
        }

        // Bước 2: Áp dụng các bộ lọc nâng cao
        return hotels.stream()
                // Lọc theo hạng sao
                .filter(h -> {
                    if (criteria.getMinStar() != null && h.getStarRating() != null) {
                        if (h.getStarRating() < criteria.getMinStar())
                            return false;
                    }
                    if (criteria.getMaxStar() != null && h.getStarRating() != null) {
                        if (h.getStarRating() > criteria.getMaxStar())
                            return false;
                    }
                    return true;
                })
                // Lọc theo giá (lowestPrice)
                .filter(h -> {
                    if (criteria.getMinPrice() != null && h.getLowestPrice() != null) {
                        if (h.getLowestPrice().compareTo(criteria.getMinPrice()) < 0)
                            return false;
                    }
                    if (criteria.getMaxPrice() != null && h.getLowestPrice() != null) {
                        if (h.getLowestPrice().compareTo(criteria.getMaxPrice()) > 0)
                            return false;
                    }
                    return true;
                })
                // Lọc theo loại khách sạn
                .filter(h -> {
                    if (criteria.getHotelType() != null) {
                        return criteria.getHotelType().equals(h.getHotelType());
                    }
                    return true;
                })
                // Lọc theo đánh giá (rating)
                .filter(h -> {
                    if (criteria.getMinRating() != null && h.getAverageRating() != null) {
                        return h.getAverageRating().compareTo(criteria.getMinRating()) >= 0;
                    }
                    return true;
                })
                // Lọc theo tiện ích (amenities) - hotel phải có TẤT CẢ các amenities được yêu
                // cầu
                .filter(h -> {
                    if (criteria.getAmenities() != null && !criteria.getAmenities().isEmpty()) {
                        if (h.getAmenities() == null || h.getAmenities().isEmpty()) {
                            return false;
                        }
                        // Kiểm tra hotel có chứa TẤT CẢ các amenities yêu cầu không
                        return h.getAmenities().containsAll(criteria.getAmenities());
                    }
                    return true;
                })
                // Lọc theo featured
                .filter(h -> {
                    if (criteria.getFeaturedOnly() != null && criteria.getFeaturedOnly()) {
                        return h.getFeatured() != null && h.getFeatured();
                    }
                    return true;
                })
                // Lọc theo verified
                .filter(h -> {
                    if (criteria.getVerifiedOnly() != null && criteria.getVerifiedOnly()) {
                        return h.getVerified() != null && h.getVerified();
                    }
                    return true;
                })
                .map(hotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 2. Get Featured Hotels
    public List<HotelDTO> findFeatured() {
        return hotelMapper.toDTOs(hotelRepository.findByFeaturedTrue());
    }

    // 2.1. Get Unique Locations from Hotels
    public List<Map<String, Object>> getUniqueLocations() {
        List<Hotel> allHotels = hotelRepository.findAll();

        // Group by locationId và đếm số hotels
        Map<String, Long> locationCounts = allHotels.stream()
                .filter(h -> h.getLocationId() != null && !h.getLocationId().isEmpty())
                .collect(Collectors.groupingBy(Hotel::getLocationId, Collectors.counting()));

        // Tạo danh sách locations với thông tin đầy đủ
        return locationCounts.entrySet().stream()
                .map(entry -> {
                    String locationId = entry.getKey();
                    Long hotelCount = entry.getValue();

                    // Lấy hotel đầu tiên của location này để lấy thông tin địa chỉ
                    Hotel sampleHotel = allHotels.stream()
                            .filter(h -> locationId.equals(h.getLocationId()))
                            .findFirst()
                            .orElse(null);

                    if (sampleHotel == null)
                        return null;

                    // Extract city từ address
                    // Format address: "Street, District, City" -> chỉ lấy City (phần cuối cùng)
                    String address = sampleHotel.getAddress();
                    String city = locationId.replace("location_", "");

                    if (address != null && address.contains(",")) {
                        String[] parts = address.split(",");
                        // Lấy phần cuối cùng = tên thành phố/tỉnh
                        if (parts.length >= 1) {
                            city = parts[parts.length - 1].trim();
                        }
                    }

                    // Use HashMap instead of Map.of() to avoid type inference issues
                    Map<String, Object> location = new HashMap<>();
                    location.put("id", locationId);
                    location.put("location_ID", locationId);
                    location.put("city", city);
                    location.put("country", "Việt Nam");
                    location.put("airport_Code", locationId.replace("location_", "").substring(0, 3).toUpperCase());
                    location.put("hotelCount", hotelCount);

                    return location;
                })
                .filter(loc -> loc != null)
                .collect(Collectors.toList());
    }

    // 3. Find by ID
    public HotelDTO findById(String id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found: " + id));
        return hotelMapper.toDTO(hotel);
    }

    // 4. Get Rooms of a Hotel
    public List<RoomDTO> findRoomsByHotelId(String hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new RuntimeException("Hotel not found");
        }
        return roomMapper.toDTOs(roomRepository.findByHotelId(hotelId));
    }

    // --- CRUD cho Admin/Vendor ---

    public List<HotelDTO> findAll() {
        return hotelMapper.toDTOs(hotelRepository.findAll());
    }

    public List<HotelDTO> findByVendorId(String vendorId) {
        return hotelMapper.toDTOs(hotelRepository.findByVendorId(vendorId));
    }

    public List<HotelDTO> findByLocationId(String locationId) {
        return hotelMapper.toDTOs(hotelRepository.findByLocationId(locationId));
    }

    public HotelDTO create(HotelDTO hotelDTO) {
        // Convert DTO -> Entity
        Hotel hotel = hotelMapper.toEntity(hotelDTO);

        // Populate City & Country
        if (hotel.getLocationId() != null) {
            com.wanderlust.api.entity.Location loc = locationRepository.findById(hotel.getLocationId()).orElse(null);
            if (loc != null) {
                hotel.setCity(loc.getName());
                if (loc.getParentLocationId() != null) {
                    com.wanderlust.api.entity.Location parent = locationRepository.findById(loc.getParentLocationId())
                            .orElse(null);
                    if (parent != null) {
                        hotel.setCountry(parent.getName());
                    }
                }
            }
        }

        // Save
        Hotel savedHotel = hotelRepository.save(hotel);
        // Return DTO
        return hotelMapper.toDTO(savedHotel);
    }

    public HotelDTO update(String id, HotelDTO hotelDTO) {
        Hotel existing = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // MapStruct tự động update các trường non-null từ DTO vào Entity cũ
        hotelMapper.updateEntityFromDTO(hotelDTO, existing);

        // Populate City & Country (if changed or missing)
        if (existing.getLocationId() != null) {
            com.wanderlust.api.entity.Location loc = locationRepository.findById(existing.getLocationId()).orElse(null);
            if (loc != null) {
                existing.setCity(loc.getName());
                if (loc.getParentLocationId() != null) {
                    com.wanderlust.api.entity.Location parent = locationRepository.findById(loc.getParentLocationId())
                            .orElse(null);
                    if (parent != null) {
                        existing.setCountry(parent.getName());
                    }
                }
            }
        }

        Hotel savedHotel = hotelRepository.save(existing);
        return hotelMapper.toDTO(savedHotel);
    }

    public void delete(String id) {
        if (!hotelRepository.existsById(id)) {
            throw new RuntimeException("Hotel not found");
        }
        hotelRepository.deleteById(id);
    }
}