package com.wanderlust.api.services;

import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.repository.CarRentalRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class CarRentalService implements BaseServices<CarRental> {

    private final CarRentalRepository carRentalRepository;

    // Get all car rentals
    public List<CarRental> findAll() {
        return carRentalRepository.findAll();
    }

    // Add a car rental
    public CarRental create(CarRental carRental) {
        return carRentalRepository.insert(carRental);
    }

    // Update an existing car rental
    public CarRental update(CarRental carRental) {
        CarRental updatedCarRental = carRentalRepository.findById(carRental.getRental_ID())
                .orElseThrow(() -> new RuntimeException("CarRental not found with id " + carRental.getRental_ID()));

        if (carRental.getCar_Type() != null) updatedCarRental.setCar_Type(carRental.getCar_Type());
        if (carRental.getCar_Model() != null) updatedCarRental.setCar_Model(carRental.getCar_Model());
        if (carRental.getRental_Cost() != null) updatedCarRental.setRental_Cost(carRental.getRental_Cost());
        if (carRental.getStatus() != null) updatedCarRental.setStatus(carRental.getStatus());

        return carRentalRepository.save(updatedCarRental);
    }

    // Delete a car rental by ID
    public void delete(String id) {
        if (carRentalRepository.findById(id).isPresent()) {
            carRentalRepository.deleteById(id);
        } else {
            throw new RuntimeException("CarRental not found with id " + id);
        }
    }

    // Delete all car rentals
    public void deleteAll() {
        carRentalRepository.deleteAll();
    }

    // Get a specific car rental by id
    public CarRental findByID(String id) {
        return carRentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CarRental not found with id " + id));
    }
}