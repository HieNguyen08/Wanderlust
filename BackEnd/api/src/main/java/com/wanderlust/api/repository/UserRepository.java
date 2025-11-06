package com.wanderlust.api.repository;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.MembershipLevel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String>{
    Optional<User> findByEmail(String email);

    Optional<User> findByUserId(String userId);
    
    List<User> findByMembershipLevel(MembershipLevel level);
    
    List<User> findByLoyaltyPointsGreaterThan(Integer points);
}
