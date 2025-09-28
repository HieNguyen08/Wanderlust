package com.wanderlust.api.services;

import com.wanderlust.api.entity.Location;
import com.wanderlust.api.repository.LocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class LocationService implements BaseServices<Location> {

    private final LocationRepository locationRepository;

    // Get all locations
    public List<Location> findAll() {
        return locationRepository.findAll();
    }

    // Add a location
    public Location create(Location location) {
        return locationRepository.insert(location);
    }

    // Update an existing location
    public Location update(Location location) {
        Location updatedLocation = locationRepository.findById(location.getLocation_ID())
                .orElseThrow(() -> new RuntimeException("Location not found with id " + location.getLocation_ID()));

        if (location.getCity() != null) updatedLocation.setCity(location.getCity());
        if (location.getCountry() != null) updatedLocation.setCountry(location.getCountry());
        if (location.getAirport_Code() != null) updatedLocation.setAirport_Code(location.getAirport_Code());
        if (location.getPostCode() != null) updatedLocation.setPostCode(location.getPostCode());

        return locationRepository.save(updatedLocation);
    }

    // Delete a location by ID
    public void delete(String id) {
        if (locationRepository.findById(id).isPresent()) {
            locationRepository.deleteById(id);
        } else {
            throw new RuntimeException("Location not found with id " + id);
        }
    }

    // Delete all locations
    public void deleteAll() {
        locationRepository.deleteAll();
    }

    // Get a specific location by id
    public Location findByID(String id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id " + id));
    }
}