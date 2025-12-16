package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.dto.hotelDTO.HotelSearchCriteria;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.ApprovalStatus;
import com.wanderlust.api.entity.types.HotelStatusType;
import com.wanderlust.api.entity.types.RoomStatusType;
import com.wanderlust.api.mapper.HotelMapper;
import com.wanderlust.api.mapper.RoomMapper;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RoomRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final HotelMapper hotelMapper;
    private final RoomMapper roomMapper;
    private final com.wanderlust.api.repository.LocationRepository locationRepository;
    private final MongoTemplate mongoTemplate;

    private boolean isApprovedActive(Hotel hotel) {
        return hotel.getApprovalStatus() == ApprovalStatus.APPROVED && hotel.getStatus() == HotelStatusType.ACTIVE;
    }

    private HotelDTO toDTOWithDerived(Hotel hotel) {
        HotelDTO dto = hotelMapper.toDTO(hotel);
        dto.setCreatedAt(hotel.getCreatedAt() != null ? hotel.getCreatedAt()
                : (hotel.getUpdatedAt() != null ? hotel.getUpdatedAt() : java.time.LocalDateTime.now()));
        dto.setUpdatedAt(hotel.getUpdatedAt());
        return dto;
    }

    private Map<String, List<RoomDTO>> mapRoomsByHotelIds(List<Hotel> hotels) {
        List<String> hotelIds = hotels.stream().map(Hotel::getHotelID).filter(Objects::nonNull)
                .collect(Collectors.toList());
        if (hotelIds.isEmpty())
            return Map.of();
        return roomRepository.findByHotelIdIn(hotelIds).stream()
                .collect(Collectors.groupingBy(Room::getHotelId,
                        Collectors.collectingAndThen(Collectors.toList(), roomMapper::toDTOs)));
    }

    private List<HotelDTO> enrichHotelsWithRooms(List<Hotel> hotels) {
        Map<String, List<RoomDTO>> roomsByHotel = mapRoomsByHotelIds(hotels);
        return hotels.stream().map(hotel -> {
            HotelDTO dto = toDTOWithDerived(hotel);
            List<RoomDTO> rooms = roomsByHotel.getOrDefault(hotel.getHotelID(), List.of());
            dto.setRooms(rooms);
            if (dto.getTotalRooms() == null) {
                dto.setTotalRooms(rooms.size());
            }
            if (dto.getLowestPrice() == null && !rooms.isEmpty()) {
                dto.setLowestPrice(rooms.stream()
                        .flatMap(r -> {
                            if (r.getOptions() != null)
                                return r.getOptions().stream().map(Room.RoomOption::getPrice);
                            return java.util.stream.Stream.of(r.getBasePrice());
                        })
                        .filter(Objects::nonNull)
                        .map(java.math.BigDecimal::doubleValue)
                        .filter(p -> p > 0)
                        .min(Double::compare)
                        .map(java.math.BigDecimal::valueOf)
                        .orElse(null));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    // 1. Search Hotels (Location, filters)
    public Page<HotelDTO> searchHotels(HotelSearchCriteria criteria, int page, int size) {
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
        List<HotelDTO> filtered = hotels.stream()
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
                    if (criteria.getHotelTypes() != null && !criteria.getHotelTypes().isEmpty()) {
                        return criteria.getHotelTypes().contains(h.getHotelType());
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
                // Chỉ trả về khách sạn đã duyệt & đang hoạt động
                .filter(this::isApprovedActive)
                .filter(this::isApprovedActive)
                .map(this::toDTOWithDerived)
                .collect(Collectors.toList());

        // Manual Pagination
        Pageable pageable = PageRequest.of(page, size);
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<HotelDTO> pageContent = filtered.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    private List<RoomDTO> filterActiveApprovedRooms(List<RoomDTO> rooms) {
        return rooms.stream()
                // Gracefully accept legacy rooms without status by treating them as
                // approved/active
                .filter(r -> r.getApprovalStatus() == null || r.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(r -> r.getStatus() == null || r.getStatus() == RoomStatusType.ACTIVE)
                .peek(r -> {
                    if (r.getApprovalStatus() == null) {
                        r.setApprovalStatus(ApprovalStatus.APPROVED);
                    }
                    if (r.getStatus() == null) {
                        r.setStatus(RoomStatusType.ACTIVE);
                    }
                })
                .collect(Collectors.toList());
    }

    // 2. Get Featured Hotels
    public List<HotelDTO> findFeatured() {
        return hotelRepository.findByFeaturedTrue().stream()
                .filter(this::isApprovedActive)
                .map(this::toDTOWithDerived)
                .collect(Collectors.toList());
    }

    // 2.1. Get Unique Locations from Hotels
    public List<Map<String, Object>> getUniqueLocations() {
        List<Hotel> allHotels = hotelRepository.findAll().stream()
                .filter(this::isApprovedActive)
                .collect(Collectors.toList());

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
        if (hotel.getApprovalStatus() != ApprovalStatus.APPROVED || hotel.getStatus() != HotelStatusType.ACTIVE) {
            throw new RuntimeException("Hotel not available");
        }
        return toDTOWithDerived(hotel);
    }

    // 4. Get Rooms of a Hotel
    public List<RoomDTO> findRoomsByHotelId(String hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new RuntimeException("Hotel not found");
        }
        return filterActiveApprovedRooms(roomMapper.toDTOs(roomRepository.findByHotelId(hotelId)));
    }

    // --- CRUD cho Admin/Vendor ---

    public List<HotelDTO> findAll() {
        return enrichHotelsWithRooms(hotelRepository.findAll());
    }

    public List<HotelDTO> findByVendorId(String vendorId) {
        return enrichHotelsWithRooms(hotelRepository.findByVendorId(vendorId));
    }

    public Page<HotelDTO> findByVendorId(String vendorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Hotel> hotelPage = hotelRepository.findByVendorId(vendorId, pageable);

        List<HotelDTO> dtos = enrichHotelsWithRooms(hotelPage.getContent());

        return new PageImpl<>(dtos, pageable, hotelPage.getTotalElements());
    }

    public Page<HotelDTO> findByVendorId(String vendorId, String search, ApprovalStatus status, int page, int size) {
        Query query = new Query();
        query.addCriteria(Criteria.where("vendorId").is(vendorId));

        if (status != null) {
            query.addCriteria(Criteria.where("approvalStatus").is(status));
        }

        if (search != null && !search.trim().isEmpty()) {
            // Search by name or description (case insensitive)
            String regex = ".*" + java.util.regex.Pattern.quote(search.trim()) + ".*";
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(regex, "i"),
                    Criteria.where("description").regex(regex, "i"),
                    Criteria.where("city").regex(regex, "i")));
        }

        Pageable pageable = PageRequest.of(page, size);
        long total = mongoTemplate.count(query, Hotel.class);
        query.with(pageable);

        List<Hotel> hotels = mongoTemplate.find(query, Hotel.class);
        List<HotelDTO> dtos = enrichHotelsWithRooms(hotels);

        return new PageImpl<>(dtos, pageable, total);
    }

    public List<HotelDTO> findByLocationId(String locationId) {
        return hotelRepository.findByLocationId(locationId).stream()
                .filter(this::isApprovedActive)
                .map(hotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Hotel approve(String id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.setApprovalStatus(ApprovalStatus.APPROVED);
        hotel.setStatus(HotelStatusType.ACTIVE);
        hotel.setAdminNote(null);
        hotel.setTotalRooms(roomRepository.findByHotelId(id).size());
        Hotel saved = hotelRepository.save(hotel);

        // Cascade approval to all rooms of this hotel
        roomRepository.findByHotelId(id).forEach(room -> {
            room.setApprovalStatus(ApprovalStatus.APPROVED);
            room.setStatus(RoomStatusType.ACTIVE);
            roomRepository.save(room);
        });

        return saved;
    }

    public Hotel reject(String id, String reason) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.setApprovalStatus(ApprovalStatus.REJECTED);
        hotel.setStatus(HotelStatusType.REJECTED);
        hotel.setAdminNote(reason);
        return hotelRepository.save(hotel);
    }

    public Hotel requestRevision(String id, String reason) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.setApprovalStatus(ApprovalStatus.PENDING);
        hotel.setStatus(HotelStatusType.PENDING_REVIEW);
        hotel.setAdminNote(reason);
        return hotelRepository.save(hotel);
    }

    public Hotel pause(String id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.setStatus(HotelStatusType.PAUSED);
        return hotelRepository.save(hotel);
    }

    public Hotel resume(String id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
        if (hotel.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("Cannot resume hotel that is not approved");
        }
        hotel.setStatus(HotelStatusType.ACTIVE);
        return hotelRepository.save(hotel);
    }

    public HotelDTO create(HotelDTO hotelDTO) {
        // Convert DTO -> Entity
        Hotel hotel = hotelMapper.toEntity(hotelDTO);

        if (hotel.getApprovalStatus() == null) {
            hotel.setApprovalStatus(ApprovalStatus.PENDING);
        }
        if (hotel.getStatus() == null) {
            hotel.setStatus(HotelStatusType.PENDING_REVIEW);
        }

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

    /**
     * Update rating aggregates for a hotel (average rating & total reviews)
     */
    public Hotel updateRatingStats(String id, BigDecimal averageRating, Integer totalReviews) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.setAverageRating(averageRating);
        hotel.setTotalReviews(totalReviews);
        return hotelRepository.save(hotel);
    }
}