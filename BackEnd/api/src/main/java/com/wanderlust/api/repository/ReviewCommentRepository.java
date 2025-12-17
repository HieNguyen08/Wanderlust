package com.wanderlust.api.repository;

import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ReviewCommentRepository extends MongoRepository<ReviewComment, String> {

        // Tìm review theo user
        Page<ReviewComment> findAllByUserId(String userId, Pageable pageable);

        // Tìm review theo đối tượng (hotel, activity...)
        List<ReviewComment> findAllByTargetTypeAndTargetId(ReviewTargetType targetType, String targetId);

        // Tìm review theo đối tượng và trạng thái (dùng để public)
        Page<ReviewComment> findAllByTargetTypeAndTargetIdAndStatus(ReviewTargetType targetType, String targetId,
                        ReviewStatus status, Pageable pageable);

        // List version for aggregation
        List<ReviewComment> findAllByTargetTypeAndTargetIdAndStatus(ReviewTargetType targetType, String targetId,
                        ReviewStatus status);

        // Tìm tất cả theo targetType và Status (cho màn hình review chung)
        Page<ReviewComment> findAllByTargetTypeAndStatus(ReviewTargetType targetType, ReviewStatus status,
                        Pageable pageable);

        // Tìm theo status và sắp xếp (cho Pending reviews)
        List<ReviewComment> findByStatusOrderByCreatedAtDesc(ReviewStatus status);

        // Tìm review theo trạng thái (dùng cho admin duyệt)
        Page<ReviewComment> findAllByStatus(ReviewStatus status, Pageable pageable);

        // Kiểm tra xem user đã review cho booking này chưa
        Optional<ReviewComment> findByBookingId(String bookingId);

        // Tìm review theo danh sách targetId (cho vendor filter)
        Page<ReviewComment> findByTargetIdIn(List<String> targetIds, Pageable pageable);

        // Tìm review theo status (không phân trang)
        List<ReviewComment> findByStatus(ReviewStatus status);

        // Statistics method
        long countByStatus(ReviewStatus status);
}