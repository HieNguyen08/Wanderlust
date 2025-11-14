package com.wanderlust.api.controller;

import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication; // <-- BỔ SUNG
import com.wanderlust.api.services.CustomUserDetails; // <-- BỔ SUNG
import com.wanderlust.api.services.CustomOAuth2User;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    private String getUserIdFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userId;
        if (principal instanceof CustomUserDetails) {
            userId = ((CustomUserDetails) principal).getUserID();
        } else if (principal instanceof CustomOAuth2User) {
            userId = ((CustomOAuth2User) principal).getUser().getUserId();
        } else {
            throw new IllegalStateException("Invalid principal type.");
        }
        if (userId == null) {
            throw new SecurityException("User ID is null in principal.");
        }
        return userId;
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

    @GetMapping("/vendor/rooms")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<List<RoomDTO>> getAllRooms(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        
        List<RoomDTO> rooms = roomService.findAllForUser(userId, new ArrayList<>(authentication.getAuthorities()));
        return ResponseEntity.ok(rooms);
    }

    // POST /api/vendor/rooms
    @PostMapping("/vendor/rooms")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isHotelOwner(authentication, #room.hotelId))") // <-- SỬA
    public ResponseEntity<RoomDTO> createRoom(@RequestBody RoomDTO room) {
        return new ResponseEntity<>(roomService.create(room), HttpStatus.CREATED);
    }
    
    // PUT /api/vendor/rooms/:id (Bổ sung update cho vendor)
    @PutMapping("/vendor/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isRoomOwner(authentication, #id))") // <-- SỬA
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable String id, @RequestBody RoomDTO room) {
        return ResponseEntity.ok(roomService.update(id, room));
    }

    // DELETE /api/vendor/rooms/:id
    @DeleteMapping("/vendor/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isRoomOwner(authentication, #id))") // <-- SỬA
    public ResponseEntity<String> deleteRoom(@PathVariable String id) {
        roomService.delete(id);
        return ResponseEntity.ok("Room deleted");
    }
}