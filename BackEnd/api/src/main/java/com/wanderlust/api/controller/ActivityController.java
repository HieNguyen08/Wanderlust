package com.wanderlust.api.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.wanderlust.api.dto.ActivityRequestDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.services.ActivityService;
import com.wanderlust.api.services.ReviewCommentService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;
    private final ReviewCommentService reviewCommentService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<Activity>> searchActivities(
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) List<ActivityCategory> categories,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) com.wanderlust.api.entity.types.ApprovalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Page<Activity> activities = activityService.searchActivities(locationId, categories, minPrice, maxPrice,
                keyword, status, page,
                size);
        return new ResponseEntity<>(activities, HttpStatus.OK);
    }

    /**
     * GET /api/activities/featured
     * Get featured activities
     */
    @GetMapping("/featured")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Activity>> getFeaturedActivities() {
        List<Activity> featured = activityService.getFeatured();
        return new ResponseEntity<>(featured, HttpStatus.OK);
    }

    /**
     * GET /api/activities/location/{locationId}
     * Get activities by location
     */
    @GetMapping("/location/{locationId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Activity>> getActivitiesByLocation(@PathVariable String locationId) {
        List<Activity> activities = activityService.findByLocationId(locationId);
        return new ResponseEntity<>(activities, HttpStatus.OK);
    }

    /**
     * GET /api/activities/{id}
     * Get activity details
     */
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Activity> getActivityById(@PathVariable String id) {
        Activity activity = activityService.findById(id);
        return new ResponseEntity<>(activity, HttpStatus.OK);
    }

    /**
     * GET /api/activities/{id}/availability
     * Check slots/availability (Simple check)
     */
    @GetMapping("/{id}/availability")
    @PreAuthorize("permitAll()")
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
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<ReviewCommentDTO>> getActivityReviews(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Gọi ReviewService để lấy review ĐÃ DUYỆT cho Activity này
        Page<ReviewCommentDTO> reviews = reviewCommentService.findAllApprovedByTarget(ReviewTargetType.ACTIVITY, id, page, size);
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
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDOR')")
    public ResponseEntity<Activity> addActivity(@RequestBody ActivityRequestDTO activityDTO) {
        Activity newActivity = activityService.create(activityDTO);
        return new ResponseEntity<>(newActivity, HttpStatus.CREATED);
    }

    /**
     * PUT /api/activities/{id}
     * Update activity
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isActivityOwner(authentication, #id))")
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
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isActivityOwner(authentication, #id))")
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

    // --- APPROVAL & OPERATIONAL STATUS ---

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Activity> approve(@PathVariable String id) {
        return ResponseEntity.ok(activityService.approve(id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Activity> reject(@PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(activityService.reject(id, reason));
    }

    @PostMapping("/{id}/request-revision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Activity> requestRevision(@PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(activityService.requestRevision(id, reason));
    }

    @PostMapping("/{id}/pause")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isActivityOwner(authentication, #id))")
    public ResponseEntity<Activity> pause(@PathVariable String id) {
        return ResponseEntity.ok(activityService.pause(id));
    }

    @PostMapping("/{id}/resume")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isActivityOwner(authentication, #id))")
    public ResponseEntity<Activity> resume(@PathVariable String id) {
        return ResponseEntity.ok(activityService.resume(id));
    }

    // PATCH /api/activities/{id}/rating - update aggregates
    @PatchMapping("/{id}/rating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Activity> updateActivityRating(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        BigDecimal avg = payload.get("averageRating") != null
                ? new BigDecimal(payload.get("averageRating").toString())
                : null;
        Integer total = payload.get("totalReviews") != null
                ? Integer.parseInt(payload.get("totalReviews").toString())
                : null;
        Activity updated = activityService.updateRatingStats(id, avg, total);
        return ResponseEntity.ok(updated);
    }
}