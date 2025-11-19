package com.wanderlust.api.controller;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.dto.hotelDTO.HotelSearchCriteria;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HotelController {

    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
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
    // --- PUBLIC / USER ENDPOINTS ---

    // GET /api/hotels/locations - Get unique locations from hotels
    @GetMapping("/hotels/locations")
    public ResponseEntity<?> getHotelLocations() {
        return ResponseEntity.ok(hotelService.getUniqueLocations());
    }

    // GET /api/hotels - Search (location, dates, etc)
    @GetMapping("/hotels")
    public ResponseEntity<List<HotelDTO>> searchHotels(@ModelAttribute HotelSearchCriteria criteria) {
        return ResponseEntity.ok(hotelService.searchHotels(criteria));
    }

    // GET /api/hotels/featured
    @GetMapping("/hotels/featured")
    public ResponseEntity<List<HotelDTO>> getFeaturedHotels() {
        return ResponseEntity.ok(hotelService.findFeatured());
    }

    // GET /api/hotels/:id
    @GetMapping("/hotels/{id}")
    public ResponseEntity<HotelDTO> getHotelById(@PathVariable String id) {
        return ResponseEntity.ok(hotelService.findById(id));
    }

    // GET /api/hotels/:id/rooms
    @GetMapping("/hotels/{id}/rooms")
    public ResponseEntity<List<RoomDTO>> getHotelRooms(@PathVariable String id) {
        return ResponseEntity.ok(hotelService.findRoomsByHotelId(id));
    }

    // GET /api/hotels/:id/reviews (Placeholder - cần ReviewService)
    @GetMapping("/hotels/{id}/reviews")
    public ResponseEntity<String> getHotelReviews(@PathVariable String id) {
        return ResponseEntity.ok("Review list placeholder for hotel " + id);
    }
    
    // POST /api/hotels/:id/check-availability
    @PostMapping("/hotels/{id}/check-availability")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> checkHotelAvailability(@PathVariable String id) {
         // Logic check tổng thể khách sạn
        return ResponseEntity.ok("Availability checked");
    }

    // --- VENDOR / ADMIN MANAGEMENT ENDPOINTS ---
    
    // GET /api/vendor/hotels
    @GetMapping("/vendor/hotels")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<List<HotelDTO>> getVendorHotels(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<HotelDTO> hotels;
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            hotels = hotelService.findAll();
        } else {
            hotels = hotelService.findByVendorId(userId);
        }
        
        return ResponseEntity.ok(hotels);
    }

    @PostMapping("/vendor/hotels")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<HotelDTO> createHotel(@RequestBody HotelDTO hotelDto, Authentication authentication) { // <-- BỔ SUNG
        String userId = getUserIdFromAuthentication(authentication);
        hotelDto.setVendorId(userId);
        HotelDTO created = hotelService.create(hotelDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/vendor/hotels/:id
    @PutMapping("/vendor/hotels/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isHotelOwner(authentication, #id))")
    public ResponseEntity<HotelDTO> updateHotel(@PathVariable String id, @RequestBody HotelDTO hotel) {
        return ResponseEntity.ok(hotelService.update(id, hotel));
    }

    // DELETE /api/vendor/hotels/:id
    @DeleteMapping("/vendor/hotels/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isHotelOwner(authentication, #id))")
    public ResponseEntity<String> deleteHotel(@PathVariable String id) {
        hotelService.delete(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }
}