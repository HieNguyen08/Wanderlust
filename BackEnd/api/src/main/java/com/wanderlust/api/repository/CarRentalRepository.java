package com.wanderlust.api.repository;

import com.wanderlust.api.entity.CarRental;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CarRentalRepository extends MongoRepository<CarRental, String> {
    List<CarRental> findByLocationId(String locationId);

    List<CarRental> findByVendorId(String vendorId);

    Page<CarRental> findByVendorId(String vendorId, Pageable pageable);
}