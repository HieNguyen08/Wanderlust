package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Room; // Use the Room entity directly
import com.wanderlust.api.services.RoomService; // Assuming you have a RoomService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Get all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> allRooms = roomService.findAll();
        return new ResponseEntity<>(allRooms, HttpStatus.OK);
    }

    // Add a room
    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        Room newRoom = roomService.create(room);
        return new ResponseEntity<>(newRoom, HttpStatus.CREATED);
    }

    // Update an existing room
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable String id, @RequestBody Room updatedRoom) {
        updatedRoom.setRoom_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            Room resultRoom = roomService.update(updatedRoom);
            return new ResponseEntity<>(resultRoom, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a room by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable String id) {
        try {
            roomService.delete(id);
            return new ResponseEntity<>("Room has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all rooms
    @DeleteMapping
    public ResponseEntity<String> deleteAllRooms() {
        roomService.deleteAll();
        return new ResponseEntity<>("All rooms have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific room by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable String id) {
        try {
            Room room = roomService.findByID(id);
            return new ResponseEntity<>(room, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}