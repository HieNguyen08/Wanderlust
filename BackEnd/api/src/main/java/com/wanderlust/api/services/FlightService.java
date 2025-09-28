package com.wanderlust.api.services;

import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.repository.FlightRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class FlightService implements BaseServices<Flight> {

    private final FlightRepository flightRepository;

    // Get all flights
    public List<Flight> findAll() {
        return flightRepository.findAll();
    }

    // Add a flight
    public Flight create(Flight flight) {
        return flightRepository.insert(flight);
    }

    // Update an existing flight
    public Flight update(Flight flight) {
        Flight updatedFlight = flightRepository.findById(flight.getId())
                .orElseThrow(() -> new RuntimeException("Flight not found with id " + flight.getId()));

        if (flight.getFlight_Number() != null) updatedFlight.setFlight_Number(flight.getFlight_Number());
        if (flight.getDeparture_Time() != null) updatedFlight.setDeparture_Time(flight.getDeparture_Time());
        if (flight.getArrival_Time() != null) updatedFlight.setArrival_Time(flight.getArrival_Time());
        if (flight.getDuration() != null) updatedFlight.setDuration(flight.getDuration());
        if (flight.getAirline_ID() != null) updatedFlight.setAirline_ID(flight.getAirline_ID());

        return flightRepository.save(updatedFlight);
    }

    // Delete a flight by ID
    public void delete(String id) {
        if (flightRepository.findById(id).isPresent()) {
            flightRepository.deleteById(id);
        } else {
            throw new RuntimeException("Flight not found with id " + id);
        }
    }

    // Delete all flights
    public void deleteAll() {
        flightRepository.deleteAll();
    }

    // Get a specific flight by id
    public Flight findByID(String id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id " + id));
    }
}