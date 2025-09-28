package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Hotel; // Use the Hotel entity directly
import com.wanderlust.api.services.HotelService; // Assuming you have a HotelService class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/hotels")
public class HotelController {

    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    // Get all hotels
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> allHotels = hotelService.findAll();
        return new ResponseEntity<>(allHotels, HttpStatus.OK);
    }

    // Add a hotel
    @PostMapping
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {
        Hotel newHotel = hotelService.create(hotel);
        return new ResponseEntity<>(newHotel, HttpStatus.CREATED);
    }

    // Update an existing hotel
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable String id, @RequestBody Hotel updatedHotel) {
        updatedHotel.setHotel_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            Hotel resultHotel = hotelService.update(updatedHotel);
            return new ResponseEntity<>(resultHotel, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a hotel by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHotel(@PathVariable String id) {
        try {
            hotelService.delete(id);
            return new ResponseEntity<>("Hotel has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all hotels
    @DeleteMapping
    public ResponseEntity<String> deleteAllHotels() {
        hotelService.deleteAll();
        return new ResponseEntity<>("All hotels have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific hotel by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable String id) {
        try {
            Hotel hotel = hotelService.findByID(id);
            return new ResponseEntity<>(hotel, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}