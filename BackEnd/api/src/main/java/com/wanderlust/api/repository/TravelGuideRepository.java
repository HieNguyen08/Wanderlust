package com.wanderlust.api.repository;

import com.wanderlust.api.entity.TravelGuide;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelGuideRepository extends MongoRepository<TravelGuide, String> {
    
    // Tìm theo destination
    List<TravelGuide> findByDestinationContainingIgnoreCase(String destination);
    
    // Tìm theo country
    List<TravelGuide> findByCountryContainingIgnoreCase(String country);
    
    // Tìm theo continent
    List<TravelGuide> findByContinent(String continent);
    
    // Tìm theo category
    List<TravelGuide> findByCategory(String category);
    
    // Tìm theo type
    List<TravelGuide> findByType(String type);
    
    // Tìm theo published status
    List<TravelGuide> findByPublished(Boolean published);
    
    // Tìm featured guides
    List<TravelGuide> findByFeaturedTrue();
    
    // Tìm theo author
    List<TravelGuide> findByAuthorId(String authorId);
    
    // Tìm theo tags
    List<TravelGuide> findByTagsContaining(String tag);
    
    // Tìm theo category và published
    List<TravelGuide> findByCategoryAndPublished(String category, Boolean published);
    
    // Tìm popular guides (sorted by views)
    List<TravelGuide> findTop10ByPublishedTrueOrderByViewsDesc();
}
