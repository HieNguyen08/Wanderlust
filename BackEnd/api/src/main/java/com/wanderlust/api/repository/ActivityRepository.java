package com.wanderlust.api.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.wanderlust.api.entity.Activity;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    
}
