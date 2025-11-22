package com.wanderlust.api.repository;

import com.wanderlust.api.entity.VisaApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisaApplicationRepository extends MongoRepository<VisaApplication, String> {
    List<VisaApplication> findByUserId(String userId);
    List<VisaApplication> findByStatus(String status);
}
