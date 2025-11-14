package com.wanderlust.api.controller;

import com.wanderlust.api.entity.VisaArticle;
import com.wanderlust.api.services.VisaArticleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visa-articles")
public class VisaArticleController {
    
    @Autowired
    private VisaArticleService visaArticleService;
    
    // Get all visa articles
    @GetMapping
    public List<VisaArticle> getAllVisaArticles() {
        return visaArticleService.getAllVisaArticles();
    }
    
    // Get visa article by ID
    @GetMapping("/{id}")
    public ResponseEntity<VisaArticle> getVisaArticleById(@PathVariable String id) {
        return visaArticleService.getVisaArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get visa article by country
    @GetMapping("/country/{country}")
    public ResponseEntity<VisaArticle> getVisaArticleByCountry(@PathVariable String country) {
        return visaArticleService.getVisaArticleByCountry(country)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get visa articles by continent
    @GetMapping("/continent/{continent}")
    public List<VisaArticle> getVisaArticlesByContinent(@PathVariable String continent) {
        return visaArticleService.getVisaArticlesByContinent(continent);
    }
    
    // Get visa articles by category
    @GetMapping("/category/{category}")
    public List<VisaArticle> getVisaArticlesByCategory(@PathVariable String category) {
        return visaArticleService.getVisaArticlesByCategory(category);
    }
    
    // Get popular visa articles
    @GetMapping("/popular")
    public List<VisaArticle> getPopularVisaArticles() {
        return visaArticleService.getPopularVisaArticles();
    }
    
    // Create new visa article
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public VisaArticle createVisaArticle(@RequestBody VisaArticle visaArticle) {
        return visaArticleService.createVisaArticle(visaArticle);
    }
    
    // Update visa article
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VisaArticle> updateVisaArticle(
            @PathVariable String id,
            @RequestBody VisaArticle visaArticleDetails) {
        try {
            VisaArticle updatedArticle = visaArticleService.updateVisaArticle(id, visaArticleDetails);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete visa article
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVisaArticle(@PathVariable String id) {
        visaArticleService.deleteVisaArticle(id);
        return ResponseEntity.noContent().build();
    }
}
