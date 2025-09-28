package com.wanderlust.api.services;

import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.repository.HotelRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class HotelService implements BaseServices<Hotel> {

    private final HotelRepository hotelRepository;

    // Get all hotels
    public List<Hotel> findAll() {
        return hotelRepository.findAll();
    }

    // Add a hotel
    public Hotel create(Hotel hotel) {
        return hotelRepository.insert(hotel);
    }

    // Update an existing hotel
    public Hotel update(Hotel hotel) {
        Hotel updatedHotel = hotelRepository.findById(hotel.getHotel_ID())
                .orElseThrow(() -> new RuntimeException("Hotel not found with id " + hotel.getHotel_ID()));

        if (hotel.getName() != null) updatedHotel.setName(hotel.getName());
        if (hotel.getContact_Number() != null) updatedHotel.setContact_Number(hotel.getContact_Number());
        if (hotel.getRating() != null) updatedHotel.setRating(hotel.getRating());
        if (hotel.getAmenities() != null) updatedHotel.setAmenities(hotel.getAmenities());

        return hotelRepository.save(updatedHotel);
    }

    // Delete a hotel by ID
    public void delete(String id) {
        if (hotelRepository.findById(id).isPresent()) {
            hotelRepository.deleteById(id);
        } else {
            throw new RuntimeException("Hotel not found with id " + id);
        }
    }

    // Delete all hotels
    public void deleteAll() {
        hotelRepository.deleteAll();
    }

    // Get a specific hotel by id
    public Hotel findByID(String id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id " + id));
    }
}