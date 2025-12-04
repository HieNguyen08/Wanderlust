package com.wanderlust.api.services;

import com.wanderlust.api.dto.ActivityRequestDTO;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.mapper.ActivityMapper;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.services.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final MongoTemplate mongoTemplate;
    private final ActivityMapper activityMapper;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserID();
        } else {
            return authentication.getName();
        }
    }

    // --- Public Get Methods ---

    public List<Activity> searchActivities(String locationId, ActivityCategory category, BigDecimal minPrice,
            BigDecimal maxPrice) {
        Query query = new Query();

        if (locationId != null && !locationId.isEmpty()) {
            query.addCriteria(Criteria.where("locationId").is(locationId));
        }
        if (category != null) {
            query.addCriteria(Criteria.where("category").is(category));
        }
        if (minPrice != null && maxPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice).lte(maxPrice));
        } else if (minPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice));
        } else if (maxPrice != null) {
            query.addCriteria(Criteria.where("price").lte(maxPrice));
        }

        query.addCriteria(Criteria.where("status").is("ACTIVE"));

        return mongoTemplate.find(query, Activity.class);
    }

    public List<Activity> getFeatured() {
        return activityRepository.findByFeaturedTrue();
    }

    public Activity findById(String id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
    }

    // --- Check Availability Logic ---
    public boolean checkAvailability(String activityId, LocalDate date, Integer guests) {
        Activity activity = findById(activityId);
        // Logic tạm thời: Chỉ check maxParticipants
        return activity.getMaxParticipants() != null && activity.getMaxParticipants() > 0;
    }

    // --- CRUD for Vendor/Admin ---

    public Activity create(ActivityRequestDTO dto) {
        String vendorId = getCurrentUserId();

        // MapStruct tự động set Default values (Status, CreatedAt...)
        Activity activity = activityMapper.toEntity(dto);

        activity.setVendorId(vendorId);
        // Tạo slug từ name (hoặc xử lý logic trùng lặp nếu cần)
        if (activity.getName() != null) {
            activity.setSlug(activity.getName().toLowerCase().replace(" ", "-"));
        }

        return activityRepository.save(activity);
    }

    public Activity update(String id, ActivityRequestDTO dto) {
        Activity existingActivity = findById(id);

        // MapStruct tự động update các trường khác null và update 'updatedAt'
        activityMapper.updateEntityFromDTO(dto, existingActivity);

        // Nếu muốn update Slug khi đổi tên, mở comment dòng dưới:
        if (dto.getName() != null)
            existingActivity.setSlug(dto.getName().toLowerCase().replace(" ", "-"));

        return activityRepository.save(existingActivity);
    }

    public void delete(String id) {
        if (activityRepository.existsById(id)) {
            activityRepository.deleteById(id);
        } else {
            throw new RuntimeException("Activity not found with id " + id);
        }
    }

    public List<Activity> findByLocationId(String locationId) {
        return activityRepository.findByLocationId(locationId);
    }

    public void deleteAll() {
        activityRepository.deleteAll();
    }
}