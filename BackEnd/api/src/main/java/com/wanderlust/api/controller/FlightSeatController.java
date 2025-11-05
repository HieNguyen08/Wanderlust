package com.wanderlust.api.controller;

import com.wanderlust.api.entity.FlightSeat; // Use the FlightSeat entity directly
import com.wanderlust.api.services.FlightSeatService; // Assuming you have a FlightSeatService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/flight-seats")
public class FlightSeatController {

    private final FlightSeatService flightSeatService;

    @Autowired
    public FlightSeatController(FlightSeatService flightSeatService) {
        this.flightSeatService = flightSeatService;
    }

    // Get all flight seats
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FlightSeat>> getAllFlightSeats() {
        List<FlightSeat> allFlightSeats = flightSeatService.findAll();
        return new ResponseEntity<>(allFlightSeats, HttpStatus.OK);
    }

    // Add a flight seat
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlightSeat> addFlightSeat(@RequestBody FlightSeat flightSeat) {
        FlightSeat newFlightSeat = flightSeatService.create(flightSeat);
        return new ResponseEntity<>(newFlightSeat, HttpStatus.CREATED);
    }

    // Update an existing flight seat
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFlightSeat(@PathVariable String id, @RequestBody FlightSeat updatedFlightSeat) {
        updatedFlightSeat.setSeat_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            FlightSeat resultFlightSeat = flightSeatService.update(updatedFlightSeat);
            return new ResponseEntity<>(resultFlightSeat, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a flight seat by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFlightSeat(@PathVariable String id) {
        try {
            flightSeatService.delete(id);
            return new ResponseEntity<>("Flight seat has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all flight seats
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllFlightSeats() {
        flightSeatService.deleteAll();
        return new ResponseEntity<>("All flight seats have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific flight seat by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFlightSeatById(@PathVariable String id) {
        try {
            FlightSeat flightSeat = flightSeatService.findByID(id);
            return new ResponseEntity<>(flightSeat, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}