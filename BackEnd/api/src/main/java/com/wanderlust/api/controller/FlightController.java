package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Flight; // Use the Flight entity directly
import com.wanderlust.api.services.FlightService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    @Autowired
    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    // Get all flights
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> allFlights = flightService.findAll();
        return new ResponseEntity<>(allFlights, HttpStatus.OK);
    }

    // Add a flight
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Flight> addFlight(@RequestBody Flight flight) {
        Flight newFlight = flightService.create(flight);
        return new ResponseEntity<>(newFlight, HttpStatus.CREATED);
    }

    // Update an existing flight
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFlight(@PathVariable String id, @RequestBody Flight updatedFlight) {
        updatedFlight.setId(id); // Ensure the ID in the entity matches the path variable
        try {
            Flight resultFlight = flightService.update(updatedFlight);
            return new ResponseEntity<>(resultFlight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a flight by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFlight(@PathVariable String id) {
        try {
            flightService.delete(id);
            return new ResponseEntity<>("Flight has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all flights
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllFlights() {
        flightService.deleteAll();
        return new ResponseEntity<>("All flights have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific flight by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFlightById(@PathVariable String id) {
        try {
            Flight flight = flightService.findByID(id);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}