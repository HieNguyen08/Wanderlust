package com.wanderlust.api.controller;

import com.wanderlust.api.dto.ActivityRequestDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.services.ActivityService;
import com.wanderlust.api.services.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;
    private final ReviewCommentService reviewCommentService;

    @GetMapping
    public ResponseEntity<List<Activity>> searchActivities(
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) ActivityCategory category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        List<Activity> activities = activityService.searchActivities(locationId, category, minPrice, maxPrice);
        return new ResponseEntity<>(activities, HttpStatus.OK);
    }

    /**
     * GET /api/activities/featured
     * Get featured activities
     */
    @GetMapping("/featured")
    public ResponseEntity<List<Activity>> getFeaturedActivities() {
        List<Activity> featured = activityService.getFeatured();
        return new ResponseEntity<>(featured, HttpStatus.OK);
    }

    /**
     * GET /api/activities/location/{locationId}
     * Get activities by location
     */
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<Activity>> getActivitiesByLocation(@PathVariable String locationId) {
        List<Activity> activities = activityService.findByLocationId(locationId);
        return new ResponseEntity<>(activities, HttpStatus.OK);
    }

    /**
     * GET /api/activities/{id}
     * Get activity details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable String id) {
        Activity activity = activityService.findById(id);
        return new ResponseEntity<>(activity, HttpStatus.OK);
    }

    /**
     * GET /api/activities/{id}/availability
     * Check slots/availability (Simple check)
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> checkAvailabilitySimple(@PathVariable String id) {
        Activity activity = activityService.findById(id);
        // Trả về thông tin cơ bản về số lượng
        return ResponseEntity.ok(Map.of(
                "activityId", id,
                "maxParticipants", activity.getMaxParticipants() != null ? activity.getMaxParticipants() : 0,
                "status", "AVAILABLE" // Placeholder logic
        ));
    }

    /**
     * GET /api/activities/{id}/reviews
     * Get reviews for an activity
     * * --- PHẦN NÀY ĐÃ ĐƯỢC CẬP NHẬT ---
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewCommentDTO>> getActivityReviews(@PathVariable String id) {
        // Gọi ReviewService để lấy review ĐÃ DUYỆT cho Activity này
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllApprovedByTarget(ReviewTargetType.ACTIVITY, id);
        return ResponseEntity.ok(reviews);
    }

    /**
     * POST /api/activities/{id}/check-availability
     * Check availability for specific date & guests
     */
    @PostMapping("/{id}/check-availability")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkSpecificAvailability(
            @PathVariable String id,
            @RequestBody Map<String, Object> requestBody) {

        String dateStr = (String) requestBody.get("date");
        Integer guests = (Integer) requestBody.get("guests");

        LocalDate date = LocalDate.parse(dateStr); // Format YYYY-MM-DD
        boolean isAvailable = activityService.checkAvailability(id, date, guests);

        return ResponseEntity.ok(Map.of(
                "available", isAvailable,
                "date", date,
                "guests", guests));
    }

    // ==========================================
    // PROTECTED ENDPOINTS (Admin/Partner)
    // ==========================================

    /**
     * POST /api/activities
     * Create new activity
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Activity> addActivity(@RequestBody ActivityRequestDTO activityDTO) {
        Activity newActivity = activityService.create(activityDTO);
        return new ResponseEntity<>(newActivity, HttpStatus.CREATED);
    }

    /**
     * PUT /api/activities/{id}
     * Update activity
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isActivityOwner(authentication, #id))")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable String id,
            @RequestBody ActivityRequestDTO activityDTO) {
        Activity updatedEntity = activityService.update(id, activityDTO);
        return new ResponseEntity<>(updatedEntity, HttpStatus.OK);
    }

    /**
     * DELETE /api/activities/{id}
     * Delete activity
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isActivityOwner(authentication, #id))")
    public ResponseEntity<String> deleteActivity(@PathVariable String id) {
        activityService.delete(id);
        return new ResponseEntity<>("Activity has been deleted successfully!", HttpStatus.OK);
    }

    /**
     * DELETE /api/activities
     * Delete all (Admin only)
     */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllActivities() {
        activityService.deleteAll();
        return new ResponseEntity<>("All activities have been deleted successfully!", HttpStatus.OK);
    }
}