package com.wanderlust.api.repository;

import com.wanderlust.api.entity.FlightSeat;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlightSeatRepository extends MongoRepository<FlightSeat, String> {
    
}
