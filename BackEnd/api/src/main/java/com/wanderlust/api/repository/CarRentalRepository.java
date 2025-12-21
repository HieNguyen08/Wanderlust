package com.wanderlust.api.repository;

import com.wanderlust.api.entity.CarRental;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRentalRepository extends MongoRepository<CarRental, String> {
    List<CarRental> findByLocationId(String locationId);

    List<CarRental> findByVendorId(String vendorId);
}