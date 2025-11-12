package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // Get all promotions
    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        List<Promotion> promotions = promotionService.getAllPromotions();
        return ResponseEntity.ok(promotions);
    }

    // Get promotion by ID
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable String id) {
        Optional<Promotion> promotion = promotionService.getPromotionById(id);
        return promotion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get promotion by code
    @GetMapping("/code/{code}")
    public ResponseEntity<Promotion> getPromotionByCode(@PathVariable String code) {
        Optional<Promotion> promotion = promotionService.getPromotionByCode(code);
        return promotion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get promotions by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Promotion>> getPromotionsByCategory(@PathVariable String category) {
        List<Promotion> promotions = promotionService.getPromotionsByCategory(category);
        return ResponseEntity.ok(promotions);
    }

    // Get promotions by destination
    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<Promotion>> getPromotionsByDestination(@PathVariable String destination) {
        List<Promotion> promotions = promotionService.getPromotionsByDestination(destination);
        return ResponseEntity.ok(promotions);
    }

    // Get featured promotions
    @GetMapping("/featured")
    public ResponseEntity<List<Promotion>> getFeaturedPromotions() {
        List<Promotion> promotions = promotionService.getFeaturedPromotions();
        return ResponseEntity.ok(promotions);
    }

    // Get active promotions
    @GetMapping("/active")
    public ResponseEntity<List<Promotion>> getActivePromotions() {
        List<Promotion> promotions = promotionService.getActivePromotions();
        return ResponseEntity.ok(promotions);
    }

    // Get active promotions by category
    @GetMapping("/active/category/{category}")
    public ResponseEntity<List<Promotion>> getActivePromotionsByCategory(@PathVariable String category) {
        List<Promotion> promotions = promotionService.getActivePromotionsByCategory(category);
        return ResponseEntity.ok(promotions);
    }

    // Get expiring soon promotions
    @GetMapping("/expiring")
    public ResponseEntity<List<Promotion>> getExpiringSoonPromotions(
            @RequestParam(defaultValue = "7") int days) {
        List<Promotion> promotions = promotionService.getExpiringSoonPromotions(days);
        return ResponseEntity.ok(promotions);
    }

    // Get newest promotions
    @GetMapping("/newest")
    public ResponseEntity<List<Promotion>> getNewestPromotions() {
        List<Promotion> promotions = promotionService.getNewestPromotions();
        return ResponseEntity.ok(promotions);
    }

    // Create new promotion
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion createdPromotion = promotionService.createPromotion(promotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotion);
    }

    // Update promotion
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(
            @PathVariable String id,
            @RequestBody Promotion promotionDetails) {
        Promotion updatedPromotion = promotionService.updatePromotion(id, promotionDetails);
        
        if (updatedPromotion != null) {
            return ResponseEntity.ok(updatedPromotion);
        }
        
        return ResponseEntity.notFound().build();
    }

    // Delete promotion
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePromotion(@PathVariable String id) {
        boolean deleted = promotionService.deletePromotion(id);
        
        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "Promotion deleted successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Promotion not found");
        return ResponseEntity.notFound().build();
    }

    // Validate promotion code
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePromotionCode(
            @RequestParam String code,
            @RequestParam String category,
            @RequestParam Double orderAmount) {
        
        boolean isValid = promotionService.validatePromotionCode(code, category, orderAmount);
        Double discount = 0.0;
        
        if (isValid) {
            discount = promotionService.calculateDiscount(code, orderAmount);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("discount", discount);
        response.put("finalAmount", orderAmount - discount);
        
        return ResponseEntity.ok(response);
    }

    // Apply promotion (increment used count)
    @PostMapping("/apply/{code}")
    public ResponseEntity<Map<String, Object>> applyPromotion(@PathVariable String code) {
        Promotion promotion = promotionService.incrementUsedCount(code);
        
        Map<String, Object> response = new HashMap<>();
        if (promotion != null) {
            response.put("success", true);
            response.put("message", "Promotion applied successfully");
            response.put("promotion", promotion);
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "Promotion not available or expired");
        return ResponseEntity.badRequest().body(response);
    }

    // Calculate discount for a promotion code
    @GetMapping("/calculate-discount")
    public ResponseEntity<Map<String, Double>> calculateDiscount(
            @RequestParam String code,
            @RequestParam Double orderAmount) {
        
        Double discount = promotionService.calculateDiscount(code, orderAmount);
        
        Map<String, Double> response = new HashMap<>();
        response.put("discount", discount);
        response.put("finalAmount", orderAmount - discount);
        
        return ResponseEntity.ok(response);
    }
}