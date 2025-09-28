package com.wanderlust.api.services;

import com.wanderlust.api.entity.Room;
import com.wanderlust.api.repository.RoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class RoomService implements BaseServices<Room> {

    private final RoomRepository roomRepository;

    // Get all rooms
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    // Add a room
    public Room create(Room room) {
        return roomRepository.insert(room);
    }

    // Update an existing room
    public Room update(Room room) {
        Room updatedRoom = roomRepository.findById(room.getRoom_ID())
                .orElseThrow(() -> new RuntimeException("Room not found with id " + room.getRoom_ID()));

        if (room.getRoom_Type() != null) updatedRoom.setRoom_Type(room.getRoom_Type());
        if (room.getPrice() != null) updatedRoom.setPrice(room.getPrice());
        if (room.getStatus() != null) updatedRoom.setStatus(room.getStatus());

        return roomRepository.save(updatedRoom);
    }

    // Delete a room by ID
    public void delete(String id) {
        if (roomRepository.findById(id).isPresent()) {
            roomRepository.deleteById(id);
        } else {
            throw new RuntimeException("Room not found with id " + id);
        }
    }

    // Delete all rooms
    public void deleteAll() {
        roomRepository.deleteAll();
    }

    // Get a specific room by id
    public Room findByID(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id " + id));
    }
}