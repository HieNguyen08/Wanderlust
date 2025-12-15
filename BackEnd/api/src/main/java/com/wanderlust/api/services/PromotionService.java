package com.wanderlust.api.services;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.UserVoucherRepository;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private UserVoucherRepository userVoucherRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    private void populateUsageStats(List<Promotion> promotions) {
        if (promotions == null || promotions.isEmpty() || userVoucherRepository == null) {
            return;
        }

        promotions.stream()
                .filter(promotion -> promotion.getId() != null)
                .forEach(promotion -> {
                    long claimedCount = userVoucherRepository.countByPromotionId(promotion.getId());
                    Integer current = promotion.getUsedCount();
                    // Only bump the stored usedCount up; never overwrite with a lower derived value
                    if (current == null || claimedCount > current) {
                        promotion.setUsedCount((int) claimedCount);
                    }
                });
    }

    private String computeStatus(Promotion promotion) {
        if (promotion == null) return "INACTIVE";
        if (promotion.isExpired()) return "EXPIRED";
        if (promotion.isExhausted()) return "EXHAUSTED";
        Boolean active = promotion.getIsActive();
        return (active != null && active) ? "ACTIVE" : "INACTIVE";
    }

    private boolean isVendorApplicable(Promotion promotion, String vendorId) {
        if (promotion == null) return false;

        // Admin-created or vendor-less promotions are global
        if (Boolean.TRUE.equals(promotion.getAdminCreateCheck())) return true;
        if (!StringUtils.hasText(promotion.getVendorId())) return true;

        // Vendor-scoped promotions require a matching vendorId
        return StringUtils.hasText(vendorId) && vendorId.equals(promotion.getVendorId());
    }

    private boolean isServiceApplicable(Promotion promotion, String serviceId) {
        if (promotion == null) return false;
        if (serviceId == null || promotion.getApplicableServices() == null || promotion.getApplicableServices().isEmpty()) {
            return true;
        }
        return promotion.getApplicableServices().stream().anyMatch(svc -> serviceId.equals(svc.getId()));
    }

    // Get all promotions
    public List<Promotion> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        populateUsageStats(promotions);
        return promotions;
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
        List<Promotion> promotions = promotionRepository.findActivePromotions(today);
        populateUsageStats(promotions);
        return promotions
                .stream()
                .filter(Promotion::isActive)
                .filter(Promotion::isAvailable)
                .collect(Collectors.toList());
    }

    // Get active promotions by category
    public List<Promotion> getActivePromotionsByCategory(String category) {
        LocalDate today = LocalDate.now();
        List<Promotion> promotions = promotionRepository.findByCategoryAndActive(category, today);
        populateUsageStats(promotions);
        return promotions
                .stream()
                .filter(Promotion::isActive)
                .filter(Promotion::isAvailable)
                .collect(Collectors.toList());
    }

    // Get expiring soon promotions (within 7 days)
    public List<Promotion> getExpiringSoonPromotions(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        List<Promotion> promotions = promotionRepository.findExpiringSoon(today, futureDate);
        populateUsageStats(promotions);
        return promotions
                .stream()
                .filter(Promotion::isActive)
                .filter(Promotion::isAvailable)
                .collect(Collectors.toList());
    }

    // Get newest promotions (sorted by start date descending)
    public List<Promotion> getNewestPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        populateUsageStats(promotions);
        return promotions
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

    // --- Vendor-scoped operations ---

    public Page<Promotion> getVendorPromotions(
            String vendorId,
            String search,
            String status,
            String type,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));

        Criteria criteria = new Criteria();
        criteria.and("vendorId").is(vendorId);
        criteria.and("adminCreateCheck").is(false);

        if (StringUtils.hasText(search)) {
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("code").regex(search, "i"),
                    Criteria.where("title").regex(search, "i")
            );
            criteria = new Criteria().andOperator(criteria, searchCriteria);
        }

        if (StringUtils.hasText(type) && !"ALL".equalsIgnoreCase(type)) {
            criteria = new Criteria().andOperator(criteria, Criteria.where("type").is(type));
        }

        Query query = new Query(criteria);
        List<Promotion> promotions = mongoTemplate.find(query, Promotion.class);
        populateUsageStats(promotions);

        List<Promotion> filtered = promotions;
        if (StringUtils.hasText(status) && !"ALL".equalsIgnoreCase(status)) {
            String target = status.toUpperCase();
            filtered = promotions.stream()
                    .filter(p -> target.equals(computeStatus(p)))
                    .collect(Collectors.toList());
        }

        long total = filtered.size();
        int fromIndex = (int) pageable.getOffset();
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), filtered.size());
        List<Promotion> pageContent = fromIndex >= filtered.size()
                ? Collections.emptyList()
                : filtered.subList(fromIndex, toIndex);

        return new PageImpl<>(pageContent, pageable, total);
    }

    public Promotion createVendorPromotion(String vendorId, Promotion promotion) {
        if (promotionRepository.existsByCode(promotion.getCode())) {
            throw new RuntimeException("Promotion code already exists");
        }
        promotion.setVendorId(vendorId);
        promotion.setAdminCreateCheck(false);
        if (promotion.getIsActive() == null) promotion.setIsActive(true);
        if (promotion.getUsedCount() == null) promotion.setUsedCount(0);
        return promotionRepository.save(promotion);
    }

    public Promotion updateVendorPromotion(String vendorId, String id, Promotion promotionDetails) {
        Optional<Promotion> optionalPromotion = promotionRepository.findById(id);
        if (optionalPromotion.isEmpty()) return null;
        Promotion promotion = optionalPromotion.get();
        if (!vendorId.equals(promotion.getVendorId()) || Boolean.TRUE.equals(promotion.getAdminCreateCheck())) {
            throw new RuntimeException("Unauthorized to update this promotion");
        }

        if (promotionDetails.getCode() != null && !promotionDetails.getCode().equals(promotion.getCode())) {
            if (promotionRepository.existsByCode(promotionDetails.getCode())) {
                throw new RuntimeException("Promotion code already exists");
            }
            promotion.setCode(promotionDetails.getCode());
        }

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
        if (promotionDetails.getIsActive() != null) promotion.setIsActive(promotionDetails.getIsActive());
        if (promotionDetails.getTotalUsesLimit() != null) promotion.setTotalUsesLimit(promotionDetails.getTotalUsesLimit());
        if (promotionDetails.getConditions() != null) promotion.setConditions(promotionDetails.getConditions());
        if (promotionDetails.getApplicableServices() != null) promotion.setApplicableServices(promotionDetails.getApplicableServices());

        return promotionRepository.save(promotion);
    }

    public boolean deleteVendorPromotion(String vendorId, String id) {
        Optional<Promotion> promotionOpt = promotionRepository.findById(id);
        if (promotionOpt.isEmpty()) return false;
        Promotion promotion = promotionOpt.get();
        if (!vendorId.equals(promotion.getVendorId()) || Boolean.TRUE.equals(promotion.getAdminCreateCheck())) {
            throw new RuntimeException("Unauthorized to delete this promotion");
        }
        promotionRepository.deleteById(id);
        return true;
    }

    public Promotion toggleVendorPromotion(String vendorId, String id, boolean active) {
        Optional<Promotion> promotionOpt = promotionRepository.findById(id);
        if (promotionOpt.isEmpty()) return null;
        Promotion promotion = promotionOpt.get();
        if (!vendorId.equals(promotion.getVendorId()) || Boolean.TRUE.equals(promotion.getAdminCreateCheck())) {
            throw new RuntimeException("Unauthorized to toggle this promotion");
        }
        if (active && !promotion.canBeToggled()) {
            throw new RuntimeException("Cannot activate an expired or exhausted promotion");
        }
        promotion.setIsActive(active);
        return promotionRepository.save(promotion);
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
            if (promotionDetails.getIsActive() != null) promotion.setIsActive(promotionDetails.getIsActive());
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
    public Promotion incrementUsedCount(String code, String vendorId, String serviceId) {
        Optional<Promotion> optionalPromotion = promotionRepository.findByCode(code);
        
        if (optionalPromotion.isPresent()) {
            Promotion promotion = optionalPromotion.get();

            // Treat empty vendorId as null for applicability checks
            if (!StringUtils.hasText(vendorId)) {
                vendorId = null;
            }

            if (!isVendorApplicable(promotion, vendorId) || !isServiceApplicable(promotion, serviceId)) {
                return null;
            }
            
            if (promotion.isActive() && promotion.isAvailable()) {
                int currentUsed = promotion.getUsedCount() == null ? 0 : promotion.getUsedCount();
                promotion.setUsedCount(currentUsed + 1);
                return promotionRepository.save(promotion);
            }
        }
        
        return null;
    }

    // Validate promotion code
    public boolean validatePromotionCode(String code, String category, Double orderAmount, String vendorId, String serviceId) {
        Optional<Promotion> optionalPromotion = promotionRepository.findByCode(code);
        
        if (optionalPromotion.isEmpty()) {
            return false;
        }
        
        Promotion promotion = optionalPromotion.get();

        if (!isVendorApplicable(promotion, vendorId)) {
            return false;
        }

        if (!isServiceApplicable(promotion, serviceId)) {
            return false;
        }
        
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
    public Double calculateDiscount(String code, Double orderAmount, String vendorId, String serviceId) {
        Optional<Promotion> optionalPromotion = promotionRepository.findByCode(code);
        
        if (optionalPromotion.isEmpty()) {
            return 0.0;
        }
        
        Promotion promotion = optionalPromotion.get();

        if (!isVendorApplicable(promotion, vendorId) || !isServiceApplicable(promotion, serviceId)) {
            return 0.0;
        }
        
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
