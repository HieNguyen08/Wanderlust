package com.wanderlust.api.controller;

import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // --- PUBLIC ENDPOINTS ---

    // GET /api/rooms/:id
    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable String id) {
        return ResponseEntity.ok(roomService.findById(id));
    }

    // GET /api/rooms/:id/availability
    @GetMapping("/rooms/{id}/availability")
    public ResponseEntity<Boolean> checkAvailability(@PathVariable String id) {
        return ResponseEntity.ok(roomService.checkAvailability(id));
    }

    // --- VENDOR MANAGEMENT ---

    // GET /api/vendor/rooms (Lấy tất cả room của vendor - placeholder logic)
    @GetMapping("/vendor/rooms")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.findAll());
    }

    // POST /api/vendor/rooms
    @PostMapping("/vendor/rooms")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return new ResponseEntity<>(roomService.create(room), HttpStatus.CREATED);
    }
    
    // PUT /api/vendor/rooms/:id (Bổ sung update cho vendor)
    @PutMapping("/vendor/rooms/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Room> updateRoom(@PathVariable String id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.update(id, room));
    }

    // DELETE /api/vendor/rooms/:id
    @DeleteMapping("/vendor/rooms/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<String> deleteRoom(@PathVariable String id) {
        roomService.delete(id);
        return ResponseEntity.ok("Room deleted");
    }
}