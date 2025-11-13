package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Promotion;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends MongoRepository<Promotion, String> {
    
    // Find by code
    Optional<Promotion> findByCode(String code);
    
    // Check if code exists
    boolean existsByCode(String code);
    
    // Find by category
    List<Promotion> findByCategory(String category);
    
    // Find by destination
    List<Promotion> findByDestination(String destination);
    
    // Find featured promotions
    List<Promotion> findByIsFeaturedTrue();
    
    // Find active promotions (between start and end date)
    @Query("{ 'startDate': { $lte: ?0 }, 'endDate': { $gte: ?0 } }")
    List<Promotion> findActivePromotions(LocalDate currentDate);
    
    // Find by category and active
    @Query("{ 'category': ?0, 'startDate': { $lte: ?1 }, 'endDate': { $gte: ?1 } }")
    List<Promotion> findByCategoryAndActive(String category, LocalDate currentDate);
    
    // Find expiring soon (within days)
    @Query("{ 'endDate': { $gte: ?0, $lte: ?1 } }")
    List<Promotion> findExpiringSoon(LocalDate startDate, LocalDate endDate);
}


