package com.wanderlust.api.services;

import com.wanderlust.api.entity.FlightSeat;
import com.wanderlust.api.repository.FlightSeatRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class FlightSeatService implements BaseServices<FlightSeat> {

    private final FlightSeatRepository flightSeatRepository;

    // Get all flight seats
    public List<FlightSeat> findAll() {
        return flightSeatRepository.findAll();
    }

    // Add a flight seat
    public FlightSeat create(FlightSeat flightSeat) {
        return flightSeatRepository.insert(flightSeat);
    }

    // Update an existing flight seat
    public FlightSeat update(FlightSeat flightSeat) {
        FlightSeat updatedFlightSeat = flightSeatRepository.findById(flightSeat.getSeat_ID())
                .orElseThrow(() -> new RuntimeException("FlightSeat not found with id " + flightSeat.getSeat_ID()));

        if (flightSeat.getSeat_Class() != null) updatedFlightSeat.setSeat_Class(flightSeat.getSeat_Class());
        if (flightSeat.getPrice() != null) updatedFlightSeat.setPrice(flightSeat.getPrice());
        if (flightSeat.getAvailability() != null) updatedFlightSeat.setAvailability(flightSeat.getAvailability());

        return flightSeatRepository.save(updatedFlightSeat);
    }

    // Delete a flight seat by ID
    public void delete(String id) {
        if (flightSeatRepository.findById(id).isPresent()) {
            flightSeatRepository.deleteById(id);
        } else {
            throw new RuntimeException("FlightSeat not found with id " + id);
        }
    }

    // Delete all flight seats
    public void deleteAll() {
        flightSeatRepository.deleteAll();
    }

    // Get a specific flight seat by id
    public FlightSeat findByID(String id) {
        return flightSeatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlightSeat not found with id " + id));
    }
}