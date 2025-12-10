package com.wanderlust.api.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wanderlust.api.dto.reviewComment.ReviewCommentAdminUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentCreateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentVendorResponseDTO;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.mapper.ReviewCommentMapper;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.ReviewCommentRepository;
import com.wanderlust.api.repository.UserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewCommentMapper reviewCommentMapper;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final ActivityRepository activityRepository;

    // ==========================================
    // COMMON/PUBLIC METHODS
    // ==========================================

    /**
     * [PUBLIC] Lấy 1 review bằng ID
     */
    public ReviewCommentDTO findById(String id) {
        ReviewComment review = findByIdOrThrow(id);
        return reviewCommentMapper.toDTO(review);
    }

    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT cho một đối tượng (Hotel, Activity...)
     */
    public List<ReviewCommentDTO> findAllApprovedByTarget(ReviewTargetType targetType, String targetId) {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByTargetTypeAndTargetIdAndStatus(
                targetType, targetId, ReviewStatus.APPROVED);
        return reviewCommentMapper.toDTOs(reviews);
    }

    // ==========================================
    // USER METHODS
    // ==========================================

    /**
     * [USER] Lấy tất cả review của user đang đăng nhập
     */
    public List<ReviewCommentDTO> findAllByUserId(String userId) {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByUserId(userId);
        return reviewCommentMapper.toDTOs(reviews);
    }

    /**
     * [USER] Tạo một review mới
     */
    public ReviewCommentDTO create(ReviewCommentCreateDTO createDTO, String userId) {
        // 1. Kiểm tra xem user đã review cho booking này chưa
        if (reviewCommentRepository.findByBookingId(createDTO.getBookingId()).isPresent()) {
            throw new IllegalArgumentException("Bạn đã đánh giá cho booking này rồi.");
        }

        // 2. Kiểm tra xem booking có tồn tại, có thuộc về user này, và đã hoàn thành
        // chưa
        Booking booking = bookingRepository.findById(createDTO.getBookingId())
                .orElseThrow(
                        () -> new NoSuchElementException("Không tìm thấy Booking với ID: " + createDTO.getBookingId()));

        if (!booking.getUserId().equals(userId)) {
            throw new SecurityException("Bạn không có quyền đánh giá cho booking này.");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Chuyến đi chưa hoàn thành, không thể đánh giá.");
        }

        ReviewComment review = reviewCommentMapper.toEntity(createDTO);
        review.setUserId(userId);
        review.setStatus(ReviewStatus.PENDING);
        review.setVerified(true);
        review.setHelpfulCount(0);
        review.setNotHelpfulCount(0);

        ReviewComment savedReview = reviewCommentRepository.save(review);
        return reviewCommentMapper.toDTO(savedReview);
    }

    /**
     * [USER] Cập nhật review của chính mình
     */
    public ReviewCommentDTO updateUserReview(String id, ReviewCommentUpdateDTO updateDTO, String userId) {
        ReviewComment review = findByIdOrThrow(id);

        if (!review.getUserId().equals(userId)) {
            throw new SecurityException("Không có quyền chỉnh sửa review này.");
        }

        reviewCommentMapper.updateEntityFromUserDTO(updateDTO, review);
        review.setStatus(ReviewStatus.PENDING);
        review.setUpdatedAt(LocalDateTime.now());

        ReviewComment updatedReview = reviewCommentRepository.save(review);
        return reviewCommentMapper.toDTO(updatedReview);
    }

    /**
     * [USER] Xóa review của chính mình
     */
    public void deleteUserReview(String id, String userId) {
        ReviewComment review = findByIdOrThrow(id);

        if (!review.getUserId().equals(userId)) {
            throw new SecurityException("Không có quyền xóa review này.");
        }

        reviewCommentRepository.delete(review);
    }

    // ==========================================
    // ADMIN METHODS
    // ==========================================

    /**
     * [ADMIN] Lấy tất cả review (không phân biệt trạng thái)
     */
    public List<ReviewCommentDTO> findAllForAdmin() {
        List<ReviewComment> reviews = reviewCommentRepository.findAll();
        return reviewCommentMapper.toDTOs(reviews);
    }

    /**
     * [ADMIN] Lấy tất cả review đang chờ duyệt
     */
    public List<ReviewCommentDTO> findAllPending() {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByStatus(ReviewStatus.PENDING);
        return reviewCommentMapper.toDTOs(reviews);
    }

    /**
     * [ADMIN] Duyệt (approve/reject/hide) một review
     */
    public ReviewCommentDTO moderateReview(String id, ReviewCommentAdminUpdateDTO adminUpdateDTO, String adminId) {
        ReviewComment review = findByIdOrThrow(id);

        reviewCommentMapper.updateEntityFromAdminDTO(adminUpdateDTO, review);
        review.setModeratedBy(adminId);
        review.setModeratedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        ReviewComment updatedReview = reviewCommentRepository.save(review);
        return reviewCommentMapper.toDTO(updatedReview);
    }

    /**
     * [ADMIN] Xóa bất kỳ review nào
     */
    public void deleteAdminReview(String id) {
        if (!reviewCommentRepository.existsById(id)) {
            throw new NoSuchElementException("Review not found with id " + id);
        }
        reviewCommentRepository.deleteById(id);
    }

    /**
     * [ADMIN] Xóa tất cả review
     */
    public void deleteAll() {
        reviewCommentRepository.deleteAll();
    }

    // ==========================================
    // VENDOR METHODS
    // ==========================================

    /**
     * [VENDOR] Thêm phản hồi cho review
     */
    public ReviewCommentDTO addVendorResponse(String id, ReviewCommentVendorResponseDTO responseDTO, String vendorId) {
        ReviewComment review = findByIdOrThrow(id);

        User vendor = userRepository.findByUserId(vendorId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Vendor (User) với ID: " + vendorId));

        if (vendor.getRole() != Role.VENDOR) {
            throw new SecurityException("User này không phải là Vendor và không có quyền phản hồi.");
        }

        Booking booking = bookingRepository.findById(review.getBookingId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Không tìm thấy Booking của review này: " + review.getBookingId()));

        if (booking.getVendorId() == null || !booking.getVendorId().equals(vendorId)) {
            throw new SecurityException(
                    "Bạn không phải là chủ sở hữu (vendor) của booking này nên không có quyền phản hồi.");
        }

        if (review.getStatus() != ReviewStatus.APPROVED) {
            throw new IllegalArgumentException("Chỉ có thể phản hồi các review đã được duyệt (APPROVED).");
        }

        reviewCommentMapper.updateEntityFromVendorDTO(responseDTO, review);
        review.setVendorRespondedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        ReviewComment updatedReview = reviewCommentRepository.save(review);
        return reviewCommentMapper.toDTO(updatedReview);
    }

    /**
     * [VENDOR] Lấy tất cả review cho các dịch vụ của Vendor
     */
    public List<ReviewCommentDTO> getReviewsByVendor(String vendorId) {
        List<String> targetIds = new ArrayList<>();

        // Get Hotel IDs
        List<com.wanderlust.api.entity.Hotel> hotels = hotelRepository.findByVendorId(vendorId);
        targetIds.addAll(hotels.stream().map(com.wanderlust.api.entity.Hotel::getHotelID).collect(Collectors.toList()));

        // Get Activity IDs
        List<com.wanderlust.api.entity.Activity> activities = activityRepository.findByVendorId(vendorId);
        targetIds.addAll(
                activities.stream().map(com.wanderlust.api.entity.Activity::getId).collect(Collectors.toList()));

        if (targetIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<ReviewComment> reviews = reviewCommentRepository.findByTargetIdIn(targetIds);
        return reviewCommentMapper.toDTOs(reviews);
    }

    /**
     * [VENDOR] Alias method for getReviewsByVendor
     */
    public List<ReviewCommentDTO> findAllByVendorId(String vendorId) {
        return getReviewsByVendor(vendorId);
    }

    /**
     * [VENDOR] Respond to a review
     */
    public ReviewCommentDTO respondToReview(String reviewId, String responseText, String vendorId) {
        ReviewCommentVendorResponseDTO responseDTO = new ReviewCommentVendorResponseDTO();
        responseDTO.setVendorResponse(responseText);
        return addVendorResponse(reviewId, responseDTO, vendorId);
    }

    // ==========================================
    // PRIVATE HELPER
    // ==========================================

    private ReviewComment findByIdOrThrow(String id) {
        return reviewCommentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ReviewComment not found with id " + id));
    }
}