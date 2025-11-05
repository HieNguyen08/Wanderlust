package com.wanderlust.api.controller;

import com.wanderlust.api.entity.CarRental; // Use the CarRental entity directly
import com.wanderlust.api.services.CarRentalService; // Assuming you have a CarRentalService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/car-rentals")
public class CarRentalController {

    private final CarRentalService carRentalService;

    @Autowired
    public CarRentalController(CarRentalService carRentalService) {
        this.carRentalService = carRentalService;
    }

    // Get all car rentals
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CarRental>> getAllCarRentals() {
        List<CarRental> allCarRentals = carRentalService.findAll();
        return new ResponseEntity<>(allCarRentals, HttpStatus.OK);
    }

    // Add a car rental
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<CarRental> addCarRental(@RequestBody CarRental carRental) {
        CarRental newCarRental = carRentalService.create(carRental);
        return new ResponseEntity<>(newCarRental, HttpStatus.CREATED);
    }

    // Update an existing car rental
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<?> updateCarRental(@PathVariable String id, @RequestBody CarRental updatedCarRental) {
        updatedCarRental.setRental_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            CarRental resultCarRental = carRentalService.update(updatedCarRental);
            return new ResponseEntity<>(resultCarRental, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a car rental by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<String> deleteCarRental(@PathVariable String id) {
        try {
            carRentalService.delete(id);
            return new ResponseEntity<>("Car rental has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all car rentals
    @DeleteMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> deleteAllCarRentals() {
        carRentalService .deleteAll();
        return new ResponseEntity<>("All car rentals have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific car rental by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCarRentalById(@PathVariable String id) {
        try {
            CarRental carRental = carRentalService.findByID(id);
            return new ResponseEntity<>(carRental, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}