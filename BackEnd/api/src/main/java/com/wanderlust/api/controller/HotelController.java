package com.wanderlust.api.controller;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.dto.hotelDTO.HotelSearchCriteria;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.services.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // --- PUBLIC / USER ENDPOINTS ---

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
    public ResponseEntity<String> checkHotelAvailability(@PathVariable String id) {
         // Logic check tổng thể khách sạn
        return ResponseEntity.ok("Availability checked");
    }

    // --- VENDOR / ADMIN MANAGEMENT ENDPOINTS ---
    
    // GET /api/vendor/hotels
    @GetMapping("/vendor/hotels")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<List<HotelDTO>> getVendorHotels() {
        // Thực tế nên filter theo Vendor ID của user đang đăng nhập
        return ResponseEntity.ok(hotelService.findAll());
    }

    // POST /api/vendor/hotels
    @PostMapping("/vendor/hotels")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        return new ResponseEntity<>(hotelService.create(hotel), HttpStatus.CREATED);
    }

    // PUT /api/vendor/hotels/:id
    @PutMapping("/vendor/hotels/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Hotel> updateHotel(@PathVariable String id, @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.update(id, hotel));
    }

    // DELETE /api/vendor/hotels/:id
    @DeleteMapping("/vendor/hotels/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<String> deleteHotel(@PathVariable String id) {
        hotelService.delete(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }
}