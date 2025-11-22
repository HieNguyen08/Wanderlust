package com.wanderlust.api.repository;

import com.wanderlust.api.entity.VisaArticle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisaArticleRepository extends MongoRepository<VisaArticle, String> {

    // Find by country
    Optional<VisaArticle> findByCountry(String country);

    // Find by continent
    List<VisaArticle> findByContinent(String continent);

    // Find by category
    List<VisaArticle> findByCategory(String category);

    // Find popular articles
    List<VisaArticle> findByPopularTrue();

    // Find by country (case insensitive)
    Optional<VisaArticle> findByCountryIgnoreCase(String country);

    // Find by title (for Global Search)
    List<VisaArticle> findByTitleContainingIgnoreCase(String title);
}
