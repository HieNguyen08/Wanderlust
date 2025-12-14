package com.wanderlust.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.hotelDTO.HotelDTO;
import com.wanderlust.api.dto.hotelDTO.HotelSearchCriteria;
import com.wanderlust.api.dto.hotelDTO.RoomDTO;
import com.wanderlust.api.mapper.HotelMapper;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.HotelService;

@RestController
@RequestMapping("/api")
public class HotelController {

    private final HotelService hotelService;
    private final HotelMapper hotelMapper;

    @Autowired
    public HotelController(HotelService hotelService, HotelMapper hotelMapper) {
        this.hotelService = hotelService;
        this.hotelMapper = hotelMapper;
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

    // GET /api/hotels/location/{locationId}
    @GetMapping("/hotels/location/{locationId}")
    public ResponseEntity<List<HotelDTO>> getHotelsByLocation(@PathVariable String locationId) {
        return ResponseEntity.ok(hotelService.findByLocationId(locationId));
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
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
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
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<HotelDTO> createHotel(@RequestBody HotelDTO hotelDto, Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        hotelDto.setVendorId(userId);
        HotelDTO created = hotelService.create(hotelDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/vendor/hotels/:id
    @PutMapping("/vendor/hotels/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isHotelOwner(authentication, #id))")
    public ResponseEntity<HotelDTO> updateHotel(@PathVariable String id, @RequestBody HotelDTO hotel) {
        return ResponseEntity.ok(hotelService.update(id, hotel));
    }

    // DELETE /api/vendor/hotels/:id
    @DeleteMapping("/vendor/hotels/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isHotelOwner(authentication, #id))")
    public ResponseEntity<String> deleteHotel(@PathVariable String id) {
        hotelService.delete(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }

    // --- APPROVAL & OPERATIONAL STATUS ---

    @PostMapping("/admin/hotels/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO> approveHotel(@PathVariable String id) {
        return ResponseEntity.ok(hotelMapper.toDTO(hotelService.approve(id)));
    }

    @PostMapping("/admin/hotels/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO> rejectHotel(@PathVariable String id, @RequestBody(required = false) java.util.Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(hotelMapper.toDTO(hotelService.reject(id, reason)));
    }

    @PostMapping("/admin/hotels/{id}/request-revision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO> requestRevisionHotel(@PathVariable String id, @RequestBody(required = false) java.util.Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(hotelMapper.toDTO(hotelService.requestRevision(id, reason)));
    }

    @PostMapping("/vendor/hotels/{id}/pause")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isHotelOwner(authentication, #id))")
    public ResponseEntity<HotelDTO> pauseHotel(@PathVariable String id) {
        return ResponseEntity.ok(hotelMapper.toDTO(hotelService.pause(id)));
    }

    @PostMapping("/vendor/hotels/{id}/resume")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isHotelOwner(authentication, #id))")
    public ResponseEntity<HotelDTO> resumeHotel(@PathVariable String id) {
        return ResponseEntity.ok(hotelMapper.toDTO(hotelService.resume(id)));
    }
}