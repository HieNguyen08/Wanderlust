package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Hotel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelRepository extends MongoRepository<Hotel, String> {
}
