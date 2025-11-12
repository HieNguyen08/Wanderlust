package com.wanderlust.api.service;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    // Get all promotions
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // Get promotion by ID
    public Optional<Promotion> getPromotionById(String id) {
        return promotionRepository.findById(id);
    }

    // Get promotion by code
    public Optional<Promotion> getPromotionByCode(String code) {
        return promotionRepository.findByCode(code);
    }

    // Get promotions by category
    public List<Promotion> getPromotionsByCategory(String category) {
        return promotionRepository.findByCategory(category);
    }

    // Get promotions by destination
    public List<Promotion> getPromotionsByDestination(String destination) {
        return promotionRepository.findByDestination(destination);
    }

    // Get featured promotions
    public List<Promotion> getFeaturedPromotions() {
        return promotionRepository.findByIsFeaturedTrue();
    }

    // Get active promotions
    public List<Promotion> getActivePromotions() {
        LocalDate today = LocalDate.now();
        return promotionRepository.findActivePromotions(today)
                .stream()
                .filter(Promotion::isAvailable)
                .collect(Collectors.toList());
    }

    // Get active promotions by category
    public List<Promotion> getActivePromotionsByCategory(String category) {
        LocalDate today = LocalDate.now();
        return promotionRepository.findByCategoryAndActive(category, today)
                .stream()
                .filter(Promotion::isAvailable)
                .collect(Collectors.toList());
    }

    // Get expiring soon promotions (within 7 days)
    public List<Promotion> getExpiringSoonPromotions(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return promotionRepository.findExpiringSoon(today, futureDate)
                .stream()
                .filter(Promotion::isActive)
                .filter(Promotion::isAvailable)
                .collect(Collectors.toList());
    }

    // Get newest promotions (sorted by start date descending)
    public List<Promotion> getNewestPromotions() {
        return promotionRepository.findAll()
                .stream()
                .filter(Promotion::isActive)
                .filter(Promotion::isAvailable)
                .sorted((a, b) -> {
                    if (a.getStartDate() == null) return 1;
                    if (b.getStartDate() == null) return -1;
                    return b.getStartDate().compareTo(a.getStartDate());
                })
                .collect(Collectors.toList());
    }

    // Create new promotion
    public Promotion createPromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    // Update promotion
    public Promotion updatePromotion(String id, Promotion promotionDetails) {
        Optional<Promotion> optionalPromotion = promotionRepository.findById(id);
        
        if (optionalPromotion.isPresent()) {
            Promotion promotion = optionalPromotion.get();
            
            if (promotionDetails.getCode() != null) promotion.setCode(promotionDetails.getCode());
            if (promotionDetails.getTitle() != null) promotion.setTitle(promotionDetails.getTitle());
            if (promotionDetails.getDescription() != null) promotion.setDescription(promotionDetails.getDescription());
            if (promotionDetails.getImage() != null) promotion.setImage(promotionDetails.getImage());
            if (promotionDetails.getType() != null) promotion.setType(promotionDetails.getType());
            if (promotionDetails.getValue() != null) promotion.setValue(promotionDetails.getValue());
            if (promotionDetails.getMaxDiscount() != null) promotion.setMaxDiscount(promotionDetails.getMaxDiscount());
            if (promotionDetails.getMinSpend() != null) promotion.setMinSpend(promotionDetails.getMinSpend());
            if (promotionDetails.getStartDate() != null) promotion.setStartDate(promotionDetails.getStartDate());
            if (promotionDetails.getEndDate() != null) promotion.setEndDate(promotionDetails.getEndDate());
            if (promotionDetails.getCategory() != null) promotion.setCategory(promotionDetails.getCategory());
            if (promotionDetails.getDestination() != null) promotion.setDestination(promotionDetails.getDestination());
            if (promotionDetails.getBadge() != null) promotion.setBadge(promotionDetails.getBadge());
            if (promotionDetails.getBadgeColor() != null) promotion.setBadgeColor(promotionDetails.getBadgeColor());
            if (promotionDetails.getIsFeatured() != null) promotion.setIsFeatured(promotionDetails.getIsFeatured());
            if (promotionDetails.getTotalUsesLimit() != null) promotion.setTotalUsesLimit(promotionDetails.getTotalUsesLimit());
            if (promotionDetails.getUsedCount() != null) promotion.setUsedCount(promotionDetails.getUsedCount());
            if (promotionDetails.getConditions() != null) promotion.setConditions(promotionDetails.getConditions());
            if (promotionDetails.getApplicableServices() != null) promotion.setApplicableServices(promotionDetails.getApplicableServices());
            
            return promotionRepository.save(promotion);
        }
        
        return null;
    }

    // Delete promotion
    public boolean deletePromotion(String id) {
        Optional<Promotion> promotion = promotionRepository.findById(id);
        if (promotion.isPresent()) {
            promotionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Increment used count
    public Promotion incrementUsedCount(String code) {
        Optional<Promotion> optionalPromotion = promotionRepository.findByCode(code);
        
        if (optionalPromotion.isPresent()) {
            Promotion promotion = optionalPromotion.get();
            
            if (promotion.isActive() && promotion.isAvailable()) {
                promotion.setUsedCount(promotion.getUsedCount() + 1);
                return promotionRepository.save(promotion);
            }
        }
        
        return null;
    }

    // Validate promotion code
    public boolean validatePromotionCode(String code, String category, Double orderAmount) {
        Optional<Promotion> optionalPromotion = promotionRepository.findByCode(code);
        
        if (optionalPromotion.isEmpty()) {
            return false;
        }
        
        Promotion promotion = optionalPromotion.get();
        
        // Check if active
        if (!promotion.isActive()) {
            return false;
        }
        
        // Check if available
        if (!promotion.isAvailable()) {
            return false;
        }
        
        // Check category (if not "all")
        if (!"all".equals(promotion.getCategory()) && !category.equals(promotion.getCategory())) {
            return false;
        }
        
        // Check minimum spend
        if (promotion.getMinSpend() != null && orderAmount < promotion.getMinSpend()) {
            return false;
        }
        
        return true;
    }

    // Calculate discount amount
    public Double calculateDiscount(String code, Double orderAmount) {
        Optional<Promotion> optionalPromotion = promotionRepository.findByCode(code);
        
        if (optionalPromotion.isEmpty()) {
            return 0.0;
        }
        
        Promotion promotion = optionalPromotion.get();
        
        if (!promotion.isActive() || !promotion.isAvailable()) {
            return 0.0;
        }
        
        Double discount = 0.0;
        
        if ("PERCENTAGE".equals(promotion.getType())) {
            discount = orderAmount * (promotion.getValue() / 100);
            
            // Apply max discount if exists
            if (promotion.getMaxDiscount() != null && discount > promotion.getMaxDiscount()) {
                discount = promotion.getMaxDiscount();
            }
        } else if ("FIXED_AMOUNT".equals(promotion.getType())) {
            discount = promotion.getValue();
        }
        
        return discount;
    }
}
