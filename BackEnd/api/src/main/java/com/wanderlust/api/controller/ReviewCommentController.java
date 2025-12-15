package com.wanderlust.api.controller;

import java.util.List;
import java.util.Map;

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
     */
    @GetMapping
    public ResponseEntity<List<ReviewCommentDTO>> getApprovedReviewsByTarget(
            @RequestParam ReviewTargetType targetType,
            @RequestParam String targetId) {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllApprovedByTarget(targetType, targetId);
        return ResponseEntity.ok(reviews);
    }

    // ==========================================
    // USER (Logged-in) ENDPOINTS
    // ==========================================

    /**
     * GET /api/reviews/my-reviews
     * Lấy tất cả review của user đang đăng nhập
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReviewCommentDTO>> getMyReviews() {
        String userId = getCurrentUserId();
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * POST /api/reviews
     * User tạo review mới
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
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
    @PreAuthorize("hasRole('USER')")
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
    @PreAuthorize("hasRole('USER')")
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
        ReviewCommentDTO updatedReview = reviewCommentService.respondToReview(id, responseText, vendorId);
        return ResponseEntity.ok(updatedReview);
    }

    /**
     * GET /api/reviews/vendor/{vendorId}
     * [PARTNER] Lấy tất cả reviews về dịch vụ của vendor   
     */
    @GetMapping("/vendor/{vendorId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<List<ReviewCommentDTO>> getReviewsByVendor(@PathVariable String vendorId) {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllByVendorId(vendorId);
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
    public ResponseEntity<List<ReviewCommentDTO>> getAllReviewsForAdmin() {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllForAdmin();
        return ResponseEntity.ok(reviews);
    }

    /**
     * GET /api/reviews/admin/pending
     * [ADMIN] Lấy review chờ duyệt
     */
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewCommentDTO>> getPendingReviews() {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllPending();
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
}