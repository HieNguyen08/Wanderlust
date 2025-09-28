package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Advertisement;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdvertisementRepository extends MongoRepository<Advertisement, String> {
    
}
