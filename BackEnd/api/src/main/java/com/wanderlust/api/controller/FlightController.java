package com.wanderlust.api.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
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

import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.types.FlightStatus;
import com.wanderlust.api.services.FlightService;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @GetMapping
    public ResponseEntity<Page<Flight>> getAllFlights(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(flightService.getAllFlights(search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable String id) {
        return flightService.getFlightById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Flight>> searchFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false, defaultValue = "false") boolean directOnly,
            @RequestParam(required = false) List<String> airlines,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String cabinClass,
            @RequestParam(required = false) String departureTimeRange,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Page<Flight> flights = flightService.searchFlights(
                from, to, date, directOnly, airlines,
                minPrice, maxPrice, cabinClass, departureTimeRange, page, size);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/range")
    public ResponseEntity<List<Flight>> getFlightsByDateRange(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Flight> flights = flightService.getFlightsByDateRange(from, to, startDate, endDate);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/nearest")
    public ResponseEntity<List<Flight>> getNearestFlights(
            @RequestParam(defaultValue = "50") int limit) {
        List<Flight> flights = flightService.getNearestFlights(limit);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/by-airline/{airlineCode}")
    public ResponseEntity<List<Flight>> getFlightsByAirline(@PathVariable String airlineCode) {
        List<Flight> flights = flightService.getFlightsByAirline(airlineCode);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<Flight>> getFlightsByType(
            @RequestParam Boolean isInternational) {
        List<Flight> flights = flightService.getFlightsByType(isInternational);
        return ResponseEntity.ok(flights);
    }

    @PostMapping
    public ResponseEntity<Flight> createFlight(@RequestBody Flight flight) {
        Flight createdFlight = flightService.createFlight(flight);
        return ResponseEntity.ok(createdFlight);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable String id, @RequestBody Flight flight) {
        Flight updatedFlight = flightService.updateFlight(id, flight);
        return ResponseEntity.ok(updatedFlight);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable String id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }

    // Decrement available seats (user-level patch)
    @PatchMapping("/{id}/available-seats/decrement")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Flight> decrementAvailableSeats(
            @PathVariable String id,
            @RequestParam(defaultValue = "1") Integer count) {
        return ResponseEntity.ok(flightService.decrementAvailableSeats(id, count));
    }

    @PutMapping("/{id}/available-seats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Flight> updateAvailableSeats(
            @PathVariable String id,
            @RequestParam Integer seatsBooked) {
        Flight updatedFlight = flightService.updateAvailableSeats(id, seatsBooked);
        return ResponseEntity.ok(updatedFlight);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Flight> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {
        try {
            FlightStatus flightStatus = FlightStatus.valueOf(status.toUpperCase());
            Flight updatedFlight = flightService.updateStatus(id, flightStatus);
            return ResponseEntity.ok(updatedFlight);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}