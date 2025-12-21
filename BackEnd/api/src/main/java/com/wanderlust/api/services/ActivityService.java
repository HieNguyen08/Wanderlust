package com.wanderlust.api.services;

import com.wanderlust.api.dto.ActivityRequestDTO;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ActivityStatus;
import com.wanderlust.api.entity.types.ApprovalStatus;
import com.wanderlust.api.mapper.ActivityMapper;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.services.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
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
    private final com.wanderlust.api.repository.LocationRepository locationRepository;

    private Activity getByIdForManagement(String id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
    }

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

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> authority.equals(a.getAuthority()));
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

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
        boolean isAdmin = isAuthenticated && hasAuthority(authentication, "ROLE_ADMIN");
        boolean isVendor = isAuthenticated
                && (hasAuthority(authentication, "ROLE_VENDOR") || hasAuthority(authentication, "ROLE_PARTNER"));

        if (isAdmin) {
            // Admin can see all activities regardless of approval/status
        } else if (isVendor) {
            // Vendors/partners see only their own submissions (any status)
            query.addCriteria(Criteria.where("vendorId").is(getCurrentUserId()));
        } else {
            // Public users only see approved + active activities
            query.addCriteria(new Criteria().andOperator(
                    Criteria.where("approvalStatus").is(ApprovalStatus.APPROVED),
                    Criteria.where("status").is(ActivityStatus.ACTIVE)));
        }

        return mongoTemplate.find(query, Activity.class);
    }

    public List<Activity> getFeatured() {
        return activityRepository.findByFeaturedTrue().stream()
                .filter(a -> a.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(a -> a.getStatus() == ActivityStatus.ACTIVE)
                .toList();
    }

    public Activity findById(String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
        if (activity.getApprovalStatus() != ApprovalStatus.APPROVED || activity.getStatus() != ActivityStatus.ACTIVE) {
            throw new RuntimeException("Activity not available");
        }
        return activity;
    }

    // --- Check Availability Logic ---
    public boolean checkAvailability(String activityId, LocalDate date, Integer guests) {
        Activity activity = findById(activityId);
        // Logic tạm thời: Chỉ check maxParticipants
        return activity.getMaxParticipants() != null && activity.getMaxParticipants() > 0;
    }

    /**
     * Update rating aggregates for activity
     */
    public Activity updateRatingStats(String id, BigDecimal averageRating, Integer totalReviews) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
        activity.setAverageRating(averageRating);
        activity.setTotalReviews(totalReviews);
        return activityRepository.save(activity);
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

        // Populate City & Country from Location
        if (activity.getLocationId() != null) {
            com.wanderlust.api.entity.Location loc = locationRepository.findById(activity.getLocationId()).orElse(null);
            if (loc != null) {
                activity.setCity(loc.getName());
                if (loc.getParentLocationId() != null) {
                    com.wanderlust.api.entity.Location parent = locationRepository.findById(loc.getParentLocationId())
                            .orElse(null);
                    if (parent != null) {
                        activity.setCountry(parent.getName());
                    }
                }
            }
        }

        if (activity.getApprovalStatus() == null) {
            activity.setApprovalStatus(ApprovalStatus.PENDING);
        }
        if (activity.getStatus() == null) {
            activity.setStatus(ActivityStatus.PENDING_REVIEW);
        }
        if (activity.getAutoCloseBeforeMinutes() == null) {
            activity.setAutoCloseBeforeMinutes(60);
        }
        if (activity.getCurrentBookings() == null) {
            activity.setCurrentBookings(0);
        }
        return activityRepository.save(activity);
    }

    public Activity update(String id, ActivityRequestDTO dto) {
        Activity existingActivity = getByIdForManagement(id);

        // MapStruct tự động update các trường khác null và update 'updatedAt'
        activityMapper.updateEntityFromDTO(dto, existingActivity);

        // Nếu muốn update Slug khi đổi tên, mở comment dòng dưới:
        if (dto.getName() != null)
            existingActivity.setSlug(dto.getName().toLowerCase().replace(" ", "-"));

        // Populate City & Country from Location (if changed or missing)
        if (existingActivity.getLocationId() != null) {
            com.wanderlust.api.entity.Location loc = locationRepository.findById(existingActivity.getLocationId())
                    .orElse(null);
            if (loc != null) {
                existingActivity.setCity(loc.getName());
                if (loc.getParentLocationId() != null) {
                    com.wanderlust.api.entity.Location parent = locationRepository.findById(loc.getParentLocationId())
                            .orElse(null);
                    if (parent != null) {
                        existingActivity.setCountry(parent.getName());
                    }
                }
            }
        }

        return activityRepository.save(existingActivity);
    }

    public Activity approve(String id) {
        Activity activity = getByIdForManagement(id);
        activity.setApprovalStatus(ApprovalStatus.APPROVED);
        activity.setStatus(ActivityStatus.ACTIVE);
        activity.setAdminNote(null);
        return activityRepository.save(activity);
    }

    public Activity reject(String id, String reason) {
        Activity activity = getByIdForManagement(id);
        activity.setApprovalStatus(ApprovalStatus.REJECTED);
        activity.setStatus(ActivityStatus.REJECTED);
        activity.setAdminNote(reason);
        return activityRepository.save(activity);
    }

    public Activity requestRevision(String id, String reason) {
        Activity activity = getByIdForManagement(id);
        activity.setApprovalStatus(ApprovalStatus.PENDING);
        activity.setStatus(ActivityStatus.PENDING_REVIEW);
        activity.setAdminNote(reason);
        return activityRepository.save(activity);
    }

    public Activity pause(String id) {
        Activity activity = getByIdForManagement(id);
        activity.setStatus(ActivityStatus.PAUSED);
        return activityRepository.save(activity);
    }

    public Activity resume(String id) {
        Activity activity = getByIdForManagement(id);
        if (activity.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("Cannot resume activity that is not approved");
        }
        activity.setStatus(ActivityStatus.ACTIVE);
        return activityRepository.save(activity);
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