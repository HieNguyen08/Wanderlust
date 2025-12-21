package com.wanderlust.api.repository;

import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCommentRepository extends MongoRepository<ReviewComment, String> {

        // Tìm review theo user
        List<ReviewComment> findAllByUserId(String userId);

        // Tìm review theo đối tượng (hotel, activity...)
        List<ReviewComment> findAllByTargetTypeAndTargetId(ReviewTargetType targetType, String targetId);

        // Tìm review theo đối tượng và trạng thái (dùng để public)
        List<ReviewComment> findAllByTargetTypeAndTargetIdAndStatus(ReviewTargetType targetType, String targetId,
                        ReviewStatus status);

        // Tìm tất cả review theo targetType và trạng thái (không cần targetId cụ thể)
        List<ReviewComment> findAllByTargetTypeAndStatus(ReviewTargetType targetType, ReviewStatus status);

        // Tìm review theo trạng thái (dùng cho admin duyệt)
        List<ReviewComment> findAllByStatus(ReviewStatus status);

        // Kiểm tra xem user đã review cho booking này chưa
        Optional<ReviewComment> findByBookingId(String bookingId);

        // Tìm review theo danh sách targetId (cho vendor filter)
        List<ReviewComment> findByTargetIdIn(List<String> targetIds);
}