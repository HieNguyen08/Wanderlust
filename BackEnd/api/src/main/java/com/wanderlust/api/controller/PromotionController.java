package com.wanderlust.api.controller;

import java.util.HashMap; // Use the Promotion entity directly
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.PromotionService;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion createdPromotion = promotionService.createPromotion(promotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotion);
    }

    // Update promotion
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> validatePromotionCode(
            @RequestParam String code,
            @RequestParam String category,
            @RequestParam Double orderAmount,
            @RequestParam String vendorId,
            @RequestParam(required = false) String serviceId) {
        
        boolean isValid = promotionService.validatePromotionCode(code, category, orderAmount, vendorId, serviceId);
        Double discount = 0.0;
        
        if (isValid) {
            discount = promotionService.calculateDiscount(code, orderAmount, vendorId, serviceId);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("discount", discount);
        response.put("finalAmount", orderAmount - discount);
        
        return ResponseEntity.ok(response);
    }

    // Apply promotion (increment used count)
    @PostMapping("/apply/{code}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> applyPromotion(
            @PathVariable String code,
            @RequestParam String vendorId,
            @RequestParam(required = false) String serviceId) {
        Promotion promotion = promotionService.incrementUsedCount(code, vendorId, serviceId);
        
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

    // Calculate discount for    a promotion code
    @GetMapping("/calculate-discount")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Double>> calculateDiscount(
            @RequestParam String code,
            @RequestParam Double orderAmount,
            @RequestParam String vendorId,
            @RequestParam(required = false) String serviceId) {
        
        Double discount = promotionService.calculateDiscount(code, orderAmount, vendorId, serviceId);
        
        Map<String, Double> response = new HashMap<>();
        response.put("discount", discount);
        response.put("finalAmount", orderAmount - discount);
        
        return ResponseEntity.ok(response);
    }

    // ========== VENDOR ENDPOINTS ==========

    /**
     * Helper method to get vendor ID from authentication
     */
    private String getVendorIdFromAuth(Authentication authentication) {
        if (authentication == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserID();
        } else if (principal instanceof CustomOAuth2User) {
            return ((CustomOAuth2User) principal).getUser().getUserId();
        }
        return authentication.getName();
    }

    // Get vendor's own promotions with pagination and filters
    @GetMapping("/vendor/my-promotions")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Page<Promotion>> getMyVendorPromotions(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        String vendorId = getVendorIdFromAuth(authentication);
        if (vendorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Page<Promotion> promotions = promotionService.getVendorPromotions(
            vendorId, search, status, type, page, size
        );
        return ResponseEntity.ok(promotions);
    }

    // Create vendor promotion
    @PostMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Promotion> createVendorPromotion(
            Authentication authentication,
            @RequestBody Promotion promotion) {
        
        String vendorId = getVendorIdFromAuth(authentication);
        if (vendorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Promotion createdPromotion = promotionService.createVendorPromotion(vendorId, promotion);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update vendor promotion
    @PutMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR') and @webSecurity.isPromotionOwner(authentication, #id)")
    public ResponseEntity<Promotion> updateVendorPromotion(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody Promotion promotionDetails) {
        
        String vendorId = getVendorIdFromAuth(authentication);
        if (vendorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Promotion updatedPromotion = promotionService.updateVendorPromotion(vendorId, id, promotionDetails);
            if (updatedPromotion != null) {
                return ResponseEntity.ok(updatedPromotion);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // Delete vendor promotion
    @DeleteMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR') and @webSecurity.isPromotionOwner(authentication, #id)")
    public ResponseEntity<Map<String, String>> deleteVendorPromotion(
            Authentication authentication,
            @PathVariable String id) {
        
        String vendorId = getVendorIdFromAuth(authentication);
        if (vendorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Map<String, String> response = new HashMap<>();
        try {
            boolean deleted = promotionService.deleteVendorPromotion(vendorId, id);
            if (deleted) {
                response.put("message", "Promotion deleted successfully");
                return ResponseEntity.ok(response);
            }
            response.put("message", "Promotion not found");
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            response.put("message", "Unauthorized to delete this promotion");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    // Toggle vendor promotion active status
    @PatchMapping("/vendor/{id}/toggle")
    @PreAuthorize("hasRole('VENDOR') and @webSecurity.isPromotionOwner(authentication, #id)")
    public ResponseEntity<Promotion> toggleVendorPromotion(
            Authentication authentication,
            @PathVariable String id,
            @RequestParam boolean active) {
        
        String vendorId = getVendorIdFromAuth(authentication);
        if (vendorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Promotion promotion = promotionService.toggleVendorPromotion(vendorId, id, active);
            if (promotion != null) {
                return ResponseEntity.ok(promotion);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}