package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.services.BookingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    // Get all bookings
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> allBookings = bookingService.findAll();
        return new ResponseEntity<>(allBookings, HttpStatus.OK);
    }

    // Add a booking
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Booking> addBooking(@RequestBody Booking booking) {
        Booking newBooking = bookingService.create(booking);
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    // Update an existing booking
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @webSecurity.isBookingOwner(authentication, #id))")
    public ResponseEntity<Booking> updateBooking(@PathVariable String id, @RequestBody Booking updatedBooking) {
        updatedBooking.setBooking_Id(id); // Ensure the ID in the entity matches the path variable
        Booking resultBooking = bookingService.update(updatedBooking);
        return new ResponseEntity<>(resultBooking, HttpStatus.OK);
    }

    // Delete a booking by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @webSecurity.isBookingOwner(authentication, #id))")
    public ResponseEntity<String> deleteBooking(@PathVariable String id) {
        try {
            bookingService.delete(id);
            return new ResponseEntity<>("Booking has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all bookings
    @DeleteMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> deleteAllBookings() {
        bookingService.deleteAll();
        return new ResponseEntity<>("All bookings have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific booking by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        Booking booking = bookingService.findByID(id);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }
}