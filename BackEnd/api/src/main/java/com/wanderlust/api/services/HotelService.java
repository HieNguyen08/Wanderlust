package com.wanderlust.api.services;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.dto.hotelDTO.HotelSearchCriteria;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.mapper.HotelMapper;
import com.wanderlust.api.mapper.RoomMapper;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final HotelMapper hotelMapper;
    private final RoomMapper roomMapper;

    // 1. Search Hotels (Location, filters)
    public List<HotelDTO> searchHotels(HotelSearchCriteria criteria) {
        if (criteria.getLocation() != null) {
            // Giả sử repository trả về List<Hotel>, mapper sẽ convert sang List<DTO>
            return hotelMapper.toDTOs(hotelRepository.searchBasic(criteria.getLocation()));
        }
        return findAll();
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
                
                if (sampleHotel == null) return null;
                
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


    public HotelDTO create(HotelDTO hotelDTO) {
        // Convert DTO -> Entity
        Hotel hotel = hotelMapper.toEntity(hotelDTO);
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