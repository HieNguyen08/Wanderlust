package com.wanderlust.api.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.wanderlust.api.entity.FlightSeat;

@Repository
public interface FlightSeatRepository extends MongoRepository<FlightSeat, String> {
    
    /**
     * Lấy tất cả ghế của một chuyến bay
     */
    List<FlightSeat> findByFlightId(String flightId);
    
    /**
     * Xóa tất cả ghế của một chuyến bay
     */
    void deleteByFlightId(String flightId);
}

