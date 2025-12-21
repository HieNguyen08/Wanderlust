package com.wanderlust.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.controller.dto.BulkFlightSeatRequest;
import com.wanderlust.api.entity.FlightSeat; // Use the FlightSeat entity directly
import com.wanderlust.api.services.FlightSeatService;

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
    public ResponseEntity<List<FlightSeat>> getAllFlightSeats() {
        List<FlightSeat> allFlightSeats = flightSeatService.findAll();
        return new ResponseEntity<>(allFlightSeats, HttpStatus.OK);
    }

    // Patch seat status (user-level, only requires authentication)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> patchSeatStatus(
            @PathVariable String id,
            @RequestParam String status) {
        try {
            FlightSeat updated = flightSeatService.updateStatus(id, status);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Add a flight seat
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlightSeat> addFlightSeat(@RequestBody FlightSeat flightSeat) {
        FlightSeat newFlightSeat = flightSeatService.create(flightSeat);
        return new ResponseEntity<>(newFlightSeat, HttpStatus.CREATED);
    }

    // Bulk create flight seats for a flight
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FlightSeat>> bulkCreateFlightSeats(@RequestBody BulkFlightSeatRequest request) {
        try {
            List<FlightSeat> createdSeats = flightSeatService.createBulkSeats(request);
            return new ResponseEntity<>(createdSeats, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing flight seat
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFlightSeat(@PathVariable String id, @RequestBody FlightSeat updatedFlightSeat) {
        updatedFlightSeat.setId(id); // Ensure the ID in the entity matches the path variable
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

    // Delete all seats for a specific flight
    @DeleteMapping("/flight/{flightId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFlightSeatsForFlight(@PathVariable String flightId) {
        try {
            flightSeatService.deleteSeatsForFlight(flightId);
            return new ResponseEntity<>("Flight seats have been deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    // Get all seats for a specific flight
    @GetMapping("/flight/{flightId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FlightSeat>> getFlightSeatsForFlight(@PathVariable String flightId) {
        try {
            List<FlightSeat> seats = flightSeatService.getSeatsForFlight(flightId);
            return new ResponseEntity<>(seats, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get available seats count by cabin class for a flight
    @GetMapping("/flight/{flightId}/available")
    public ResponseEntity<?> getAvailableSeatsByClass(@PathVariable String flightId) {
        try {
            java.util.Map<String, Long> availableSeats = flightSeatService.getAvailableSeatsByClass(flightId);
            return new ResponseEntity<>(availableSeats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}