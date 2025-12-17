package com.wanderlust.api.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.reviewComment.ReviewCommentAdminUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentCreateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentUpdateDTO;
import com.wanderlust.api.entity.ReviewVote;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.services.CustomUserDetails;
import com.wanderlust.api.services.ReviewCommentService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewCommentController {

    private final ReviewCommentService reviewCommentService;

    /**
     * Helper
     * Lấy ID của user đang được xác thực
     */
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

    // ==========================================
    // PUBLIC ENDPOINTS
    // ==========================================

    /**
     * GET /api/reviews/{id}
     * Lấy chi tiết 1 review
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewCommentDTO> getReviewById(@PathVariable String id) {
        ReviewCommentDTO review = reviewCommentService.findById(id);
        return ResponseEntity.ok(review);
    }

    /**
     * GET /api/reviews
     * Lấy reviews đã duyệt theo target (hotel, activity...)
     * VD: /api/reviews?targetType=HOTEL&targetId=123
     * Hoặc lấy tất cả theo type: /api/reviews?targetType=FLIGHT (không cần
     * targetId)
     */
    @GetMapping
    public ResponseEntity<Page<ReviewCommentDTO>> getApprovedReviewsByTarget(
            @RequestParam ReviewTargetType targetType,
            @RequestParam(required = false) String targetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewCommentDTO> reviews;

        if (targetId == null || targetId.trim().isEmpty() ||
                targetId.equalsIgnoreCase("ALL") || targetId.equalsIgnoreCase("ALL_FLIGHTS")) {
            // Lấy tất cả reviews theo targetType
            reviews = reviewCommentService.findAllApprovedByType(targetType, page, size);
        } else {
            // Lấy reviews cho targetId cụ thể
            reviews = reviewCommentService.findAllApprovedByTarget(targetType, targetId, page, size);
        }

        return ResponseEntity.ok(reviews);
    }

    /**
     * POST /api/reviews/{id}/vote
     * Toggle helpful / not helpful for authenticated user
     */
    @PostMapping("/{id}/vote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewCommentDTO> voteReview(
            @PathVariable String id,
            @RequestParam ReviewVote.VoteType voteType) {
        String userId = getCurrentUserId();
        ReviewCommentDTO updated = reviewCommentService.toggleVote(id, voteType, userId);
        return ResponseEntity.ok(updated);
    }

    // ==========================================
    // USER (Logged-in) ENDPOINTS
    // ==========================================

    /**
     * GET /api/reviews/my-reviews
     * Lấy tất cả review của user đang đăng nhập
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ReviewCommentDTO>> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = getCurrentUserId();
        Page<ReviewCommentDTO> reviews = reviewCommentService.findAllByUserId(userId, page, size);
        return ResponseEntity.ok(reviews);
    }

    /**
     * POST /api/reviews
     * User tạo review mới
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewCommentDTO> createReview(@RequestBody ReviewCommentCreateDTO createDTO) {
        String userId = getCurrentUserId();
        ReviewCommentDTO newReview = reviewCommentService.create(createDTO, userId);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    /**
     * PUT /api/reviews/{id}
     * User cập nhật review của chính mình
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewCommentDTO> updateMyReview(
            @PathVariable String id,
            @RequestBody ReviewCommentUpdateDTO updateDTO) {
        String userId = getCurrentUserId();
        ReviewCommentDTO updatedReview = reviewCommentService.updateUserReview(id, updateDTO, userId);
        return ResponseEntity.ok(updatedReview);
    }

    /**
     * DELETE /api/reviews/{id}
     * User xóa review của chính mình
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMyReview(@PathVariable String id) {
        String userId = getCurrentUserId();
        reviewCommentService.deleteUserReview(id, userId);
        return ResponseEntity.noContent().build(); // Status 204
    }

    // ==========================================
    // PARTNER (VENDOR) ENDPOINTS
    // ==========================================

    /**
     * POST /api/reviews/{id}/respond
     * [PARTNER] Vendor phản hồi review
     */
    @PostMapping("/{id}/respond")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ReviewCommentDTO> respondToReview(
            @PathVariable String id,
            @RequestBody Map<String, String> response) {
        String vendorId = getCurrentUserId();
        String responseText = response.get("response");
        if (responseText == null) {
            responseText = response.get("responseContent");
        }
        ReviewCommentDTO updatedReview = reviewCommentService.respondToReview(id, responseText, vendorId);
        return ResponseEntity.ok(updatedReview);
    }

    /**
     * GET /api/reviews/vendor/{vendorId}
     * [PARTNER] Lấy tất cả reviews về dịch vụ của vendor (Paginated, Search,
     * Status)
     */
    @GetMapping("/vendor/{vendorId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<ReviewCommentDTO>> getReviewsByVendor(
            @PathVariable String vendorId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewCommentDTO> reviews = reviewCommentService.getReviewsByVendor(vendorId, search, status, page, size);
        return ResponseEntity.ok(reviews);
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================
    /**
     * GET /api/reviews/admin/all
     * [ADMIN] Lấy tất cả review (mọi trạng thái)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReviewCommentDTO>> getAllReviewsForAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewCommentDTO> reviews = reviewCommentService.findAllForAdmin(search, status, page, size);
        return ResponseEntity.ok(reviews);
    }

    /**
     * GET /api/reviews/admin/pending
     * [ADMIN] Lấy review chờ duyệt
     */
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<ReviewCommentDTO>> getPendingReviews() {
        java.util.List<ReviewCommentDTO> reviews = reviewCommentService.findPendingReviews();
        return ResponseEntity.ok(reviews);
    }

    /**
     * PUT /api/reviews/admin/{id}/moderate
     * [ADMIN] Duyệt (approve/reject/hide) review
     */
    @PutMapping("/admin/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewCommentDTO> moderateReview(
            @PathVariable String id,
            @RequestBody ReviewCommentAdminUpdateDTO adminUpdateDTO) {
        String adminId = getCurrentUserId();
        ReviewCommentDTO moderatedReview = reviewCommentService.moderateReview(id, adminUpdateDTO, adminId);
        return ResponseEntity.ok(moderatedReview);
    }

    /**
     * DELETE /api/reviews/admin/{id}
     * [ADMIN] Xóa bất kỳ review nào
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReviewByAdmin(@PathVariable String id) {
        reviewCommentService.deleteAdminReview(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/reviews/admin/all
     * [ADMIN] Xóa tất cả review
     */
    @DeleteMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllReviewsByAdmin() {
        reviewCommentService.deleteAll();
        return ResponseEntity.ok("All reviews have been deleted.");
    }

    // ==========================================
    // STATISTICS ENDPOINTS
    // ==========================================

    /**
     * GET /api/reviews/admin/stats
     * [ADMIN] Get review statistics for admin dashboard
     */
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getAdminReviewStats() {
        return ResponseEntity.ok(reviewCommentService.getAdminReviewStats());
    }

    /**
     * GET /api/reviews/vendor/{vendorId}/stats
     * [VENDOR] Get review statistics for vendor dashboard
     */
    @GetMapping("/vendor/{vendorId}/stats")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getVendorReviewStats(@PathVariable String vendorId) {
        return ResponseEntity.ok(reviewCommentService.getVendorStats(vendorId));
    }
}
