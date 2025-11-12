package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Promotion; // Use the Promotion entity directly
import com.wanderlust.api.services.PromotionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    @Autowired
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // Get all promotions
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        List<Promotion> allPromotions = promotionService.findAll();
        return new ResponseEntity<>(allPromotions, HttpStatus.OK);
    }

    // Add a promotion
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Promotion> addPromotion(@RequestBody Promotion promotion) {
        Promotion newPromotion = promotionService.create(promotion);
        return new ResponseEntity<>(newPromotion, HttpStatus.CREATED);
    }

    // Update an existing promotion
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isPromotionOwner(authentication, #id))")
    public ResponseEntity<?> updatePromotion(@PathVariable String id, @RequestBody Promotion updatedPromotion) {
        updatedPromotion.setPromotion_ID(id); // Ensure the ID in the entity matches the path variable
        try {
            Promotion resultPromotion = promotionService.update(updatedPromotion);
            return new ResponseEntity<>(resultPromotion, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a promotion by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isPromotionOwner(authentication, #id))")
    public ResponseEntity<String> deletePromotion(@PathVariable String id) {
        try {
            promotionService.delete(id);
            return new ResponseEntity<>("Promotion has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete all promotions
    @DeleteMapping
    public ResponseEntity<String> deleteAllPromotions() {
        promotionService.deleteAll();
        return new ResponseEntity<>("All promotions have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific promotion by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getPromotionById(@PathVariable String id) {
        try {
            Promotion promotion = promotionService.findByID(id);
            return new ResponseEntity<>(promotion, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}