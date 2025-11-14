package com.wanderlust.api.services;

import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.mapper.RoomMapper;
import com.wanderlust.api.repository.RoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

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
    
    public List<RoomDTO> findAll() {
        return roomMapper.toDTOs(roomRepository.findAll());
    }

    public RoomDTO create(RoomDTO roomDTO) {
        // MapStruct: DTO -> Entity
        Room room = roomMapper.toEntity(roomDTO);
        Room savedRoom = roomRepository.save(room);
        // MapStruct: Entity -> DTO
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