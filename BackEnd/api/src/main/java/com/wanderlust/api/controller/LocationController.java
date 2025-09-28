package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Location; // Use the Location entity directly
import com.wanderlust.api.services.LocationService; // Assuming you have a LocationService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/locations")
public class LocationController {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // Get all locations
    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> allLocations = locationService.findAll();
        return new ResponseEntity<>(allLocations, HttpStatus.OK);
    }

    // Add a location
    @PostMapping
    public ResponseEntity<Location> addLocation(@RequestBody Location location) {
        Location newLocation = locationService.create(location);
        return new ResponseEntity<>(newLocation, HttpStatus.CREATED);
    }

    // Update an existing location
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLocation(@PathVariable String id, @RequestBody Location updatedLocation) {
        updatedLocation.setLocation_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            Location resultLocation = locationService.update(updatedLocation);
            return new ResponseEntity<>(resultLocation, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a location by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable String id) {
        try {
            locationService.delete(id);
            return new ResponseEntity<>("Location has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all locations
    @DeleteMapping
    public ResponseEntity<String> deleteAllLocations() {
        locationService.deleteAll();
        return new ResponseEntity<>("All locations have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific location by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable String id) {
        try {
            Location location = locationService.findByID(id);
            return new ResponseEntity<>(location, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}