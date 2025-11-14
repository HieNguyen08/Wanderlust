package com.wanderlust.api.controller;

import com.wanderlust.api.dto.locationDTO.LocationRequestDTO;
import com.wanderlust.api.dto.locationDTO.LocationResponseDTO;
import com.wanderlust.api.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // 1. GET /api/locations - Lấy danh sách locations (có pagination)
    @GetMapping
    // @PreAuthorize("isAuthenticated()") // Có thể mở public cho khách xem
    public ResponseEntity<Page<LocationResponseDTO>> getAllLocations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "popularity") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return new ResponseEntity<>(locationService.findAll(pageable), HttpStatus.OK);
    }

    // 2. GET /api/locations/featured - Lấy locations nổi bật
    @GetMapping("/featured")
    public ResponseEntity<List<LocationResponseDTO>> getFeaturedLocations() {
        return new ResponseEntity<>(locationService.findFeatured(), HttpStatus.OK);
    }

    // 3. GET /api/locations/search - Tìm kiếm location theo query
    @GetMapping("/search")
    public ResponseEntity<List<LocationResponseDTO>> searchLocations(@RequestParam String query) {
        return new ResponseEntity<>(locationService.search(query), HttpStatus.OK);
    }

    // 4. GET /api/locations/:id - Lấy chi tiết location
    @GetMapping("/{id}")
    public ResponseEntity<LocationResponseDTO> getLocationById(@PathVariable String id) {
        try {
            return new ResponseEntity<>(locationService.findByID(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. POST /api/locations - Create new (Admin/Partner)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<LocationResponseDTO> addLocation(@RequestBody LocationRequestDTO locationDTO) {
        LocationResponseDTO newLocation = locationService.create(locationDTO);
        return new ResponseEntity<>(newLocation, HttpStatus.CREATED);
    }

    // 6. PUT /api/locations/:id - Update (Admin/Partner)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PARTNER')") // Logic check owner nên đưa vào service hoặc giữ logic security cũ của bạn
    public ResponseEntity<?> updateLocation(@PathVariable String id, @RequestBody LocationRequestDTO locationDTO) {
        try {
            LocationResponseDTO result = locationService.update(id, locationDTO);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 7. DELETE /api/locations/:id - Delete (Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteLocation(@PathVariable String id) {
        try {
            locationService.delete(id);
            return new ResponseEntity<>("Location has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // DELETE ALL
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllLocations() {
        locationService.deleteAll();
        return new ResponseEntity<>("All locations have been deleted successfully!", HttpStatus.OK);
    }
}