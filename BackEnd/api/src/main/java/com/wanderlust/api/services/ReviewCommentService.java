package com.wanderlust.api.services;

import com.wanderlust.api.dto.reviewComment.*;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.mapper.ReviewCommentMapper;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.ReviewCommentRepository;
import com.wanderlust.api.repository.UserRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@AllArgsConstructor
@Service
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewCommentMapper reviewCommentMapper;
    
    // === ĐÃ HOÀN THIỆN INJECT REPO ===
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    // =================================

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
        
        // === Logic kiểm tra nghiệp vụ (Quan trọng) ===
        // 1. Kiểm tra xem user đã review cho booking này chưa
        if (reviewCommentRepository.findByBookingId(createDTO.getBookingId()).isPresent()) {
            throw new IllegalArgumentException("Bạn đã đánh giá cho booking này rồi.");
        }

        // 2. TODO: Kiểm tra xem booking có tồn tại, có thuộc về user này, và đã hoàn thành chưa
        // === BẮT ĐẦU PHẦN HOÀN THIỆN ===
        Booking booking = bookingRepository.findById(createDTO.getBookingId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Booking với ID: " + createDTO.getBookingId()));
        
        if (!booking.getUserId().equals(userId)) {
            throw new SecurityException("Bạn không có quyền đánh giá cho booking này.");
        }
        
        // Kiểm tra trạng thái booking đã hoàn thành (Dựa trên Booking.java và BookingStatus)
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Chuyến đi chưa hoàn thành, không thể đánh giá.");
        }
        // === KẾT THÚC PHẦN HOÀN THIỆN ===
        // =============================================

        ReviewComment review = reviewCommentMapper.toEntity(createDTO);
        review.setUserId(userId);
        review.setStatus(ReviewStatus.PENDING); // Mặc định chờ duyệt
        review.setVerified(true); // Đã qua bước check booking
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

        // Kiểm tra quyền sở hữu
        if (!review.getUserId().equals(userId)) {
            throw new SecurityException("Không có quyền chỉnh sửa review này.");
        }

        reviewCommentMapper.updateEntityFromUserDTO(updateDTO, review);
        review.setStatus(ReviewStatus.PENDING); // Sau khi sửa -> phải duyệt lại
        review.setUpdatedAt(LocalDateTime.now());
        
        ReviewComment updatedReview = reviewCommentRepository.save(review);
        return reviewCommentMapper.toDTO(updatedReview);
    }

    /**
     * [USER] Xóa review của chính mình
     */
    public void deleteUserReview(String id, String userId) {
        ReviewComment review = findByIdOrThrow(id);
        
        // Kiểm tra quyền sở hữu
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
    // PARTNER METHODS (VENDOR)
    // ==========================================

    /**
     * [PARTNER] Thêm phản hồi cho review
     */
    public ReviewCommentDTO addVendorResponse(String id, ReviewCommentVendorResponseDTO responseDTO, String partnerId) {
        ReviewComment review = findByIdOrThrow(id);

        // === Logic kiểm tra nghiệp vụ (Quan trọng) ===
        // TODO: Kiểm tra xem partnerId (vendor) này có phải là chủ sở hữu
        // của targetId (hotel, activity...) trong review hay không.
        
        // === BẮT ĐẦU PHẦN HOÀN THIỆN ===
        
        // 1. Kiểm tra xem partnerId có phải là PARTNER không (Dựa trên User.java và UserRepository.java)
        User partner = userRepository.findByUserId(partnerId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Partner (User) với ID: " + partnerId));
        
        // (Dựa trên User.java -> role và yêu cầu "vendor là user có role là partner")
        if (partner.getRole() != Role.PARTNER) {
             throw new SecurityException("User này không phải là Partner và không có quyền phản hồi.");
        }

        // 2. Kiểm tra xem partner này có phải là chủ của booking không
        // (Cách làm này đúng cho cả Hotel, Flight, Activity... miễn là Booking.vendorId được gán đúng)
        // (Dựa trên ReviewComment.java -> bookingId và Booking.java -> vendorId)
        Booking booking = bookingRepository.findById(review.getBookingId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Booking của review này: " + review.getBookingId()));

        if (booking.getVendorId() == null || !booking.getVendorId().equals(partnerId)) {
            throw new SecurityException("Bạn không phải là chủ sở hữu (vendor) của booking này nên không có quyền phản hồi.");
        }
        
        // === KẾT THÚC PHẦN HOÀN THIỆN ===
        // =============================================

        // Chỉ cho phép phản hồi review đã được duyệt
        if (review.getStatus() != ReviewStatus.APPROVED) {
            throw new IllegalArgumentException("Chỉ có thể phản hồi các review đã được duyệt (APPROVED).");
        }

        reviewCommentMapper.updateEntityFromVendorDTO(responseDTO, review);
        review.setVendorRespondedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        ReviewComment updatedReview = reviewCommentRepository.save(review);
        return reviewCommentMapper.toDTO(updatedReview);
    }


    // ==========================================
    // PRIVATE HELPER
    // ==========================================

    private ReviewComment findByIdOrThrow(String id) {
        return reviewCommentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ReviewComment not found with id " + id));
    }
}