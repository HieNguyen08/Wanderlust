package com.wanderlust.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.locationDTO.LocationRequestDTO;
import com.wanderlust.api.dto.locationDTO.LocationResponseDTO;
import com.wanderlust.api.services.LocationService;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // 1. GET /api/locations - Lấy danh sách locations (có pagination)
    @GetMapping
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

    // 4.1 GET /api/locations/type/:type - Get by Type (CONTRY, CITY)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LocationResponseDTO>> getLocationsByType(@PathVariable String type) {
        try {
            return new ResponseEntity<>(locationService.findByType(type), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 4.2 GET /api/locations/parent/:parentId - Get by Parent ID
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<LocationResponseDTO>> getLocationsByParentId(@PathVariable String parentId) {
        return new ResponseEntity<>(locationService.findByParentId(parentId), HttpStatus.OK);
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
    @PreAuthorize("hasRole('ADMIN')")
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