package com.wanderlust.api.controller;

import com.wanderlust.api.dto.reviewComment.*;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.services.ReviewCommentService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/review-comments")
@AllArgsConstructor
public class ReviewCommentController {

    private final ReviewCommentService reviewCommentService;

    // ==========================================
    // 1. PUBLIC ENDPOINTS (Không cần đăng nhập)
    // ==========================================

    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT cho 1 đối tượng (hotel, activity...)
     */
    @GetMapping("/target/{targetType}/{targetId}")
    public ResponseEntity<List<ReviewCommentDTO>> getApprovedReviewsForTarget(
            @PathVariable ReviewTargetType targetType,
            @PathVariable String targetId) {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllApprovedByTarget(targetType, targetId);
        return ResponseEntity.ok(reviews);
    }

    // ==========================================
    // 2. AUTHENTICATED ENDPOINTS (Cần đăng nhập)
    // ==========================================

    /**
     * [AUTH] Lấy chi tiết 1 review bằng ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewCommentDTO> getReviewById(@PathVariable String id) {
        try {
            ReviewCommentDTO review = reviewCommentService.findById(id);
            return ResponseEntity.ok(review);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // ==========================================
    // 3. USER ENDPOINTS (ROLE_USER)
    // ==========================================

    /**
     * [USER] Tạo 1 review mới
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewCommentDTO> createReview(
            @Valid @RequestBody ReviewCommentCreateDTO createDTO,
            Authentication authentication) {
        
        // TODO: Lấy User ID từ Authentication.
        // Ví dụ: UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        // String userId = userPrincipal.getId();
        String userId = "placeholder-user-id-from-auth"; // <--- THAY THẾ CHỖ NÀY

        try {
            ReviewCommentDTO newReview = reviewCommentService.create(createDTO, userId);
            return new ResponseEntity<>(newReview, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tạo review.");
        }
    }

    /**
     * [USER] Lấy tất cả review của tôi
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReviewCommentDTO>> getMyReviews(Authentication authentication) {
        String userId = "placeholder-user-id-from-auth"; // <--- THAY THẾ CHỖ NÀY
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * [USER] Cập nhật review của tôi
     */
    @PutMapping("/my-reviews/{id}")
    @PreAuthorize("hasRole('USER') and @webSecurity.isReviewCommentOwner(authentication, #id)")
    public ResponseEntity<ReviewCommentDTO> updateMyReview(
            @PathVariable String id,
            @Valid @RequestBody ReviewCommentUpdateDTO updateDTO,
            Authentication authentication) {
        
        String userId = "placeholder-user-id-from-auth"; // <--- THAY THẾ CHỖ NÀY
        try {
            ReviewCommentDTO updatedReview = reviewCommentService.updateUserReview(id, updateDTO, userId);
            return ResponseEntity.ok(updatedReview);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (SecurityException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    /**
     * [USER] Xóa review của tôi
     */
    @DeleteMapping("/my-reviews/{id}")
    @PreAuthorize("hasRole('USER') and @webSecurity.isReviewCommentOwner(authentication, #id)")
    public ResponseEntity<String> deleteMyReview(
            @PathVariable String id,
            Authentication authentication) {
        
        String userId = "placeholder-user-id-from-auth"; // <--- THAY THẾ CHỖ NÀY
        try {
            reviewCommentService.deleteUserReview(id, userId);
            return ResponseEntity.ok("Đã xóa review thành công.");
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (SecurityException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    // ==========================================
    // 4. PARTNER ENDPOINTS (ROLE_PARTNER)
    // ==========================================

    /**
     * [PARTNER] Phản hồi 1 review
     * (Cần kiểm tra xem partner này có sở hữu 'targetId' của review không)
     */
    @PutMapping("/partner/response/{id}")
    @PreAuthorize("hasRole('PARTNER') and @webSecurity.isReviewTargetOwner(authentication, #id)")
    public ResponseEntity<ReviewCommentDTO> addVendorResponse(
            @PathVariable String id,
            @Valid @RequestBody ReviewCommentVendorResponseDTO responseDTO,
            Authentication authentication) {

        String partnerId = "placeholder-partner-id-from-auth"; // <--- THAY THẾ CHỖ NÀY
        try {
            ReviewCommentDTO updatedReview = reviewCommentService.addVendorResponse(id, responseDTO, partnerId);
            return ResponseEntity.ok(updatedReview);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (SecurityException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ==========================================
    // 5. ADMIN ENDPOINTS (ROLE_ADMIN)
    // ==========================================

    /**
     * [ADMIN] Lấy TẤT CẢ review (mọi trạng thái)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewCommentDTO>> getAllReviewsForAdmin() {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllForAdmin();
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * [ADMIN] Lấy tất cả review CHỜ DUYỆT
     */
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewCommentDTO>> getPendingReviewsForAdmin() {
        List<ReviewCommentDTO> reviews = reviewCommentService.findAllPending();
        return ResponseEntity.ok(reviews);
    }

    /**
     * [ADMIN] Duyệt/Cập nhật trạng thái 1 review
     */
    @PutMapping("/admin/moderate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewCommentDTO> moderateReview(
            @PathVariable String id,
            @Valid @RequestBody ReviewCommentAdminUpdateDTO adminUpdateDTO,
            Authentication authentication) {
        
        String adminId = "placeholder-admin-id-from-auth"; // <--- THAY THẾ CHỖ NÀY
        try {
            ReviewCommentDTO updatedReview = reviewCommentService.moderateReview(id, adminUpdateDTO, adminId);
            return ResponseEntity.ok(updatedReview);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * [ADMIN] Xóa bất kỳ 1 review
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteReviewByAdmin(@PathVariable String id) {
        try {
            reviewCommentService.deleteAdminReview(id);
            return ResponseEntity.ok("Admin đã xóa review thành công.");
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * [ADMIN] Xóa TẤT CẢ review (Cẩn thận khi dùng!)
     */
    @DeleteMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllReviewsByAdmin() {
        reviewCommentService.deleteAll();
        return ResponseEntity.ok("Admin đã xóa TẤT CẢ review thành công.");
    }
}