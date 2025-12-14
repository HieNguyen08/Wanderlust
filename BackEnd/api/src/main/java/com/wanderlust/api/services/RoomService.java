package com.wanderlust.api.services;

import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Hotel; // <-- Bổ sung
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.ApprovalStatus; // <-- Bổ sung
import com.wanderlust.api.entity.types.HotelStatusType; // <-- Bổ sung
import com.wanderlust.api.entity.types.RoomStatusType; // <-- Bổ sung
import com.wanderlust.api.mapper.RoomMapper;
import com.wanderlust.api.repository.HotelRepository; // <-- Bổ sung
import com.wanderlust.api.repository.RoomRepository;
import org.springframework.stereotype.Service;

import org.springframework.security.core.GrantedAuthority; // <-- Bổ sung
import org.springframework.security.core.authority.SimpleGrantedAuthority; // <-- Bổ sung
import java.util.Collection; // <-- Bổ sung
import java.util.stream.Collectors; // <-- Bổ sung
import org.springframework.beans.factory.annotation.Autowired; // <-- Bổ sung

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final HotelRepository hotelRepository; // <-- Bổ sung dependency

    @Autowired
    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.roomMapper = roomMapper;
        this.hotelRepository = hotelRepository; // <-- Bổ sung
    }

    public RoomDTO findById(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found: " + id));
        return roomMapper.toDTO(room);
    }
    
    // Check availability
    public boolean checkAvailability(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return room.getAvailableRooms() != null && room.getAvailableRooms() > 0;
    }

    // --- CRUD ---
    public List<RoomDTO> findAllForUser(String userId, Collection<GrantedAuthority> authorities) {
        boolean isAdmin = authorities.contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (isAdmin) {
            return roomMapper.toDTOs(roomRepository.findAll());
        }
        List<Hotel> vendorHotels = hotelRepository.findByVendorId(userId);
        
        if (vendorHotels.isEmpty()) {
            return List.of(); // Partner này không sở hữu hotel nào
        }
        
        List<String> hotelIds = vendorHotels.stream()
                                            .map(Hotel::getHotelID)
                                            .collect(Collectors.toList());

        List<Room> vendorRooms = roomRepository.findAll().stream()
                .filter(r -> r.getHotelId() != null && hotelIds.contains(r.getHotelId()))
                .collect(Collectors.toList());
        
        return roomMapper.toDTOs(vendorRooms);
    }

    public RoomDTO create(RoomDTO roomDTO) {
        if (roomDTO.getHotelId() == null || roomDTO.getHotelId().isEmpty()) {
            throw new RuntimeException("Hotel ID is required for room creation");
        }

        Room room = roomMapper.toEntity(roomDTO);

        // Default status based on parent hotel's approval/operational state
        Hotel parentHotel = hotelRepository.findById(room.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found for room"));
        boolean hotelIsApprovedActive = parentHotel.getApprovalStatus() == ApprovalStatus.APPROVED
                && parentHotel.getStatus() == HotelStatusType.ACTIVE;

        if (room.getApprovalStatus() == null) {
            room.setApprovalStatus(hotelIsApprovedActive ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING);
        }
        if (room.getStatus() == null) {
            room.setStatus(hotelIsApprovedActive ? RoomStatusType.ACTIVE : RoomStatusType.PENDING_REVIEW);
        }

        Room savedRoom = roomRepository.save(room);
        return roomMapper.toDTO(savedRoom);
    }

    public RoomDTO update(String id, RoomDTO roomDTO) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        // Sử dụng MapStruct để update đè các field thay vì set thủ công
        roomMapper.updateEntityFromDTO(roomDTO, existing);
        
        Room savedRoom = roomRepository.save(existing);
        return roomMapper.toDTO(savedRoom);
    }
    
    public void delete(String id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(id);
    }
    
    public void deleteAll() {
        roomRepository.deleteAll();
    }
}