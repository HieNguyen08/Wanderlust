package com.wanderlust.api.service;

import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.repository.VisaArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class VisaArticleService {
    
    @Autowired
    private VisaArticleRepository visaArticleRepository;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    
    // Get all visa articles
    public List<VisaArticle> getAllVisaArticles() {
        return visaArticleRepository.findAll();
    }
    
    // Get visa article by ID
    public Optional<VisaArticle> getVisaArticleById(String id) {
        return visaArticleRepository.findById(id);
    }
    
    // Get visa article by country
    public Optional<VisaArticle> getVisaArticleByCountry(String country) {
        return visaArticleRepository.findByCountryIgnoreCase(country);
    }
    
    // Get visa articles by continent
    public List<VisaArticle> getVisaArticlesByContinent(String continent) {
        return visaArticleRepository.findByContinent(continent);
    }
    
    // Get visa articles by category
    public List<VisaArticle> getVisaArticlesByCategory(String category) {
        return visaArticleRepository.findByCategory(category);
    }
    
    // Get popular visa articles
    public List<VisaArticle> getPopularVisaArticles() {
        return visaArticleRepository.findByPopularTrue();
    }
    
    // Create new visa article
    public VisaArticle createVisaArticle(VisaArticle visaArticle) {
        String now = LocalDateTime.now().format(formatter);
        visaArticle.setCreatedAt(now);
        visaArticle.setUpdatedAt(now);
        return visaArticleRepository.save(visaArticle);
    }
    
    // Update visa article
    public VisaArticle updateVisaArticle(String id, VisaArticle visaArticleDetails) {
        Optional<VisaArticle> optionalVisaArticle = visaArticleRepository.findById(id);
        
        if (optionalVisaArticle.isPresent()) {
            VisaArticle visaArticle = optionalVisaArticle.get();
            
            if (visaArticleDetails.getTitle() != null) {
                visaArticle.setTitle(visaArticleDetails.getTitle());
            }
            if (visaArticleDetails.getCountry() != null) {
                visaArticle.setCountry(visaArticleDetails.getCountry());
            }
            if (visaArticleDetails.getFlag() != null) {
                visaArticle.setFlag(visaArticleDetails.getFlag());
            }
            if (visaArticleDetails.getContinent() != null) {
                visaArticle.setContinent(visaArticleDetails.getContinent());
            }
            if (visaArticleDetails.getExcerpt() != null) {
                visaArticle.setExcerpt(visaArticleDetails.getExcerpt());
            }
            if (visaArticleDetails.getImage() != null) {
                visaArticle.setImage(visaArticleDetails.getImage());
            }
            if (visaArticleDetails.getReadTime() != null) {
                visaArticle.setReadTime(visaArticleDetails.getReadTime());
            }
            if (visaArticleDetails.getCategory() != null) {
                visaArticle.setCategory(visaArticleDetails.getCategory());
            }
            if (visaArticleDetails.getProcessingTime() != null) {
                visaArticle.setProcessingTime(visaArticleDetails.getProcessingTime());
            }
            if (visaArticleDetails.getPopular() != null) {
                visaArticle.setPopular(visaArticleDetails.getPopular());
            }
            if (visaArticleDetails.getFee() != null) {
                visaArticle.setFee(visaArticleDetails.getFee());
            }
            if (visaArticleDetails.getValidity() != null) {
                visaArticle.setValidity(visaArticleDetails.getValidity());
            }
            if (visaArticleDetails.getRequirements() != null) {
                visaArticle.setRequirements(visaArticleDetails.getRequirements());
            }
            if (visaArticleDetails.getSteps() != null) {
                visaArticle.setSteps(visaArticleDetails.getSteps());
            }
            if (visaArticleDetails.getTips() != null) {
                visaArticle.setTips(visaArticleDetails.getTips());
            }
            if (visaArticleDetails.getFaqs() != null) {
                visaArticle.setFaqs(visaArticleDetails.getFaqs());
            }
            
            visaArticle.setUpdatedAt(LocalDateTime.now().format(formatter));
            return visaArticleRepository.save(visaArticle);
        }
        
        throw new RuntimeException("Visa article not found with id: " + id);
    }
    
    // Delete visa article
    public void deleteVisaArticle(String id) {
        visaArticleRepository.deleteById(id);
    }
}
