package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.wanderlust.api.dto.reviewComment.ReviewCommentAdminUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentCreateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentVendorResponseDTO;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.ReviewVote;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.mapper.ReviewCommentMapper;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.FlightRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.ReviewCommentRepository;
import com.wanderlust.api.repository.ReviewVoteRepository;
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
    private final CarRentalRepository carRentalRepository;
    private final FlightRepository flightRepository;
    private final ReviewVoteRepository reviewVoteRepository;
    private final org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    // ==========================================
    // COMMON/PUBLIC METHODS
    // ==========================================

    /**
     * [PUBLIC] Lấy 1 review bằng ID
     */
    public ReviewCommentDTO findById(String id) {
        ReviewComment review = findByIdOrThrow(id);
        return toDTO(review);
    }

    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT cho một đối tượng (Hotel, Activity...)
     */
    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT cho một đối tượng (Hotel, Activity...)
     */
    public Page<ReviewCommentDTO> findAllApprovedByTarget(ReviewTargetType targetType, String targetId, int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewComment> reviews = reviewCommentRepository.findAllByTargetTypeAndTargetIdAndStatus(
                targetType, targetId, ReviewStatus.APPROVED, pageable);
        return reviews.map(this::toDTO);
    }

    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT theo loại (FLIGHT, HOTEL...) không cần
     * targetId cụ thể
     * Sắp xếp theo rating từ cao đến thấp
     */
    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT theo loại (FLIGHT, HOTEL...) không cần
     * targetId cụ thể
     * Sắp xếp theo rating từ cao đến thấp
     */
    public Page<ReviewCommentDTO> findAllApprovedByType(ReviewTargetType targetType, int page, int size) {
        // Note: Repository method currently doesn't sort by rating.
        // We'd need to add Sort to Pageable or custom query.
        // For now, let's just use PageRequest defaults (which effectively is unsorted
        // unless we add Sort).
        // To keep existing logic "sort by rating", we might need a Sort param.
        // Let's rely on frontend or add Sort.by(Direction.DESC, "rating") if 'rating'
        // field exists and is indexed.
        // Assuming 'rating' field exists.

        // Pageable pageable = PageRequest.of(page, size,
        // org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
        // "rating"));
        // But let's verify if column name is "rating". Yes, ReviewComment entity has
        // rating.
        // NOTE: Standard PageRequest sort operates on DB level.

        Pageable pageable = PageRequest.of(page, size); // Add sort here if needed
        Page<ReviewComment> reviews = reviewCommentRepository.findAllByTargetTypeAndStatus(
                targetType, ReviewStatus.APPROVED, pageable);

        return reviews.map(this::toDTO);
    }

    // ==========================================
    // USER METHODS
    // ==========================================

    /**
     * [USER] Lấy tất cả review của user đang đăng nhập
     */
    /**
     * [USER] Lấy tất cả review của user đang đăng nhập
     */
    public Page<ReviewCommentDTO> findAllByUserId(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewComment> reviews = reviewCommentRepository.findAllByUserId(userId, pageable);
        return reviews.map(this::toDTO);
    }

    /**
     * [USER] Tạo một review mới
     */
    public ReviewCommentDTO create(ReviewCommentCreateDTO createDTO, String userId) {
        // 1. Kiểm tra xem booking có tồn tại, có thuộc về user này, và đã hoàn thành
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

        // 2. Kiểm tra xem user đã review cho booking này chưa (kiểm tra flag hasReview)
        // Ngoại trừ review WEBSITE (có thể cập nhật nhiều lần)
        if (createDTO.getTargetType() != ReviewTargetType.WEBSITE) {
            if (Boolean.TRUE.equals(booking.getHasReview())) {
                throw new IllegalArgumentException("Bạn đã đánh giá cho booking này rồi.");
            }
        }

        ReviewComment review = reviewCommentMapper.toEntity(createDTO);
        review.setUserId(userId);

        // If this is a WEBSITE review, use provided targetType and targetId
        if (createDTO.getTargetType() == ReviewTargetType.WEBSITE) {
            review.setTargetType(ReviewTargetType.WEBSITE);
            review.setTargetId(createDTO.getTargetId() != null ? createDTO.getTargetId() : "WANDERLUST");
        } else {
            applyTargetFromBooking(review, booking);
        }

        applyTravelContext(review, booking);
        review.setStatus(ReviewStatus.PENDING);
        review.setVerified(true);
        review.setHelpfulCount(0);
        review.setNotHelpfulCount(0);

        ReviewComment savedReview = reviewCommentRepository.save(review);

        // Mark booking as reviewed (only for non-WEBSITE reviews)
        if (createDTO.getTargetType() != ReviewTargetType.WEBSITE) {
            booking.setHasReview(true);
            bookingRepository.save(booking);
        }

        return toDTO(savedReview);
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
        return toDTO(updatedReview);
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
        recalcTargetAggregates(review.getTargetType(), review.getTargetId());
    }

    // ==========================================
    // ADMIN METHODS
    // ==========================================

    /**
     * [ADMIN] Lấy tất cả review (không phân biệt trạng thái)
     */
    /**
     * [ADMIN] Lấy tất cả review (không phân biệt trạng thái)
     */
    public Page<ReviewCommentDTO> findAllForAdmin(String search, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query()
                .with(pageable);

        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("all")) {
            try {
                ReviewStatus statusEnum = ReviewStatus.valueOf(status.toUpperCase());
                query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("status").is(statusEnum));
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore or handle? Ignoring for now to treat as "all" or just
                // non-matching
            }
        }

        if (search != null && !search.trim().isEmpty()) {
            String regex = ".*" + java.util.regex.Pattern.quote(search.trim()) + ".*";
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("content").regex(regex, "i"));
        }

        long total = mongoTemplate.count(query, ReviewComment.class);
        List<ReviewComment> reviews = mongoTemplate.find(query, ReviewComment.class);

        return new org.springframework.data.domain.PageImpl<>(toDTOs(reviews), pageable, total);
    }

    /**
     * [ADMIN] Lấy tất cả review đang chờ duyệt
     */
    /**
     * [ADMIN] Lấy tất cả review đang chờ duyệt
     */
    public Page<ReviewCommentDTO> findAllPending(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewComment> reviews = reviewCommentRepository.findAllByStatus(ReviewStatus.PENDING, pageable);
        return reviews.map(this::toDTO);
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
        recalcTargetAggregates(review.getTargetType(), review.getTargetId());
        return toDTO(updatedReview);
    }

    /**
     * [ADMIN] Xóa bất kỳ review nào
     */
    public void deleteAdminReview(String id) {
        if (!reviewCommentRepository.existsById(id)) {
            throw new NoSuchElementException("Review not found with id " + id);
        }
        ReviewComment existing = reviewCommentRepository.findById(id).orElse(null);
        reviewCommentRepository.deleteById(id);
        if (existing != null) {
            recalcTargetAggregates(existing.getTargetType(), existing.getTargetId());
        }
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
        return toDTO(updatedReview);
    }

    /**
     * [VENDOR] Lấy tất cả review cho các dịch vụ của Vendor
     */
    /**
     * [VENDOR] Lấy tất cả review cho các dịch vụ của Vendor (Paginated, Search,
     * Status)
     */
    public Page<ReviewCommentDTO> getReviewsByVendor(String vendorId, String search, String status, int page,
            int size) {
        List<String> targetIds = new ArrayList<>();

        // Get Hotel IDs
        List<com.wanderlust.api.entity.Hotel> hotels = hotelRepository.findByVendorId(vendorId);
        targetIds.addAll(hotels.stream().map(com.wanderlust.api.entity.Hotel::getHotelID).collect(Collectors.toList()));

        // Get Activity IDs
        List<com.wanderlust.api.entity.Activity> activities = activityRepository.findByVendorId(vendorId);
        targetIds.addAll(
                activities.stream().map(com.wanderlust.api.entity.Activity::getId).collect(Collectors.toList()));

        // Get Car Rental IDs (Added as per plan)
        List<com.wanderlust.api.entity.CarRental> cars = carRentalRepository.findByVendorId(vendorId);
        targetIds.addAll(
                cars.stream().map(com.wanderlust.api.entity.CarRental::getId).collect(Collectors.toList()));

        if (targetIds.isEmpty()) {
            return Page.empty();
        }

        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("targetId").in(targetIds));

        // Filter by Status (Pending vs Responded)
        // Frontend uses: "pending" (unanswered), "responded". Default "all".
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
            if (status.equalsIgnoreCase("pending") || status.equalsIgnoreCase("unanswered")) {
                // Not responded yet: vendorResponse is null or empty
                query.addCriteria(new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorResponse").is(null),
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorResponse").is("")));
            } else if (status.equalsIgnoreCase("responded")) {
                // Has response
                query.addCriteria(
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorResponse").ne(null).ne(""));
            }
        }

        // Search logic
        if (search != null && !search.trim().isEmpty()) {
            String regex = ".*" + java.util.regex.Pattern.quote(search.trim()) + ".*";
            // Check review content or user? ReviewComment doesn't store userName directly
            // usually?
            // Wait, toDTO enriches user info. We CANNOT search by user name easily in the
            // DB query unless we join or fetch users first.
            // Let's search by 'content' (comment/title) for now.
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("content").regex(regex, "i"));
        }

        long total = mongoTemplate.count(query, ReviewComment.class);
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        query.with(pageable);

        List<ReviewComment> reviews = mongoTemplate.find(query, ReviewComment.class);
        return new org.springframework.data.domain.PageImpl<>(toDTOs(reviews), pageable, total);
    }

    /**
     * [VENDOR] Alias method for getReviewsByVendor
     */
    public Page<ReviewCommentDTO> findAllByVendorId(String vendorId, int page, int size) {
        return getReviewsByVendor(vendorId, null, null, page, size);
    }

    /**
     * [VENDOR] Respond to a review
     */
    public ReviewCommentDTO respondToReview(String reviewId, String responseText, String vendorId) {
        ReviewCommentVendorResponseDTO responseDTO = new ReviewCommentVendorResponseDTO();
        responseDTO.setVendorResponse(responseText);
        return addVendorResponse(reviewId, responseDTO, vendorId);
    }

    /**
     * [PUBLIC] Vote helpful / not helpful
     */
    public ReviewCommentDTO toggleVote(String reviewId, ReviewVote.VoteType voteType, String userId) {
        ReviewComment review = findByIdOrThrow(reviewId);

        Optional<ReviewVote> existing = reviewVoteRepository.findByReviewIdAndUserId(reviewId, userId);

        // If same vote exists -> remove (toggle off)
        if (existing.isPresent() && existing.get().getVoteType() == voteType) {
            reviewVoteRepository.delete(existing.get());
            adjustVoteCounters(review, voteType, -1);
        } else {
            // Switch vote if different
            existing.ifPresent(reviewVoteRepository::delete);
            ReviewVote vote = new ReviewVote();
            vote.setReviewId(reviewId);
            vote.setUserId(userId);
            vote.setVoteType(voteType);
            reviewVoteRepository.save(vote);

            // If switched from opposite, decrement opposite then increment desired
            if (existing.isPresent()) {
                adjustVoteCounters(review, existing.get().getVoteType(), -1);
            }
            adjustVoteCounters(review, voteType, 1);
        }

        review.setUpdatedAt(LocalDateTime.now());
        ReviewComment saved = reviewCommentRepository.save(review);
        return toDTO(saved);
    }

    // ==========================================
    // PRIVATE HELPER
    // ==========================================

    private ReviewComment findByIdOrThrow(String id) {
        return reviewCommentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ReviewComment not found with id " + id));
    }

    private void applyTargetFromBooking(ReviewComment review, Booking booking) {
        if (booking.getBookingType() == null) {
            throw new IllegalArgumentException("Booking type is missing, không xác định được đối tượng review.");
        }

        switch (booking.getBookingType()) {
            case HOTEL:
                review.setTargetType(ReviewTargetType.HOTEL);
                review.setTargetId(booking.getHotelId());
                break;
            case CAR_RENTAL:
                review.setTargetType(ReviewTargetType.CAR);
                review.setTargetId(booking.getCarRentalId());
                break;
            case ACTIVITY:
                review.setTargetType(ReviewTargetType.ACTIVITY);
                review.setTargetId(booking.getActivityId());
                break;
            case FLIGHT:
                review.setTargetType(ReviewTargetType.FLIGHT);
                String flightId = null;
                List<String> flightIds = booking.getFlightId();
                if (flightIds != null && !flightIds.isEmpty()) {
                    flightId = flightIds.get(0);
                }
                review.setTargetId(flightId);
                if (flightId != null) {
                    Optional<Flight> flightOpt = flightRepository.findById(flightId);
                    if (flightOpt.isPresent()) {
                        fillFlightMetadata(review, flightOpt.get());
                    }
                }
                break;
            default:
                throw new IllegalArgumentException("Booking type không hỗ trợ review: " + booking.getBookingType());
        }

        if (review.getTargetId() == null || review.getTargetId().isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy targetId từ booking để tạo review.");
        }
    }

    private void applyTravelContext(ReviewComment review, Booking booking) {
        if (review.getTravelDate() == null) {
            LocalDate autoDate = booking.getStartDate() != null ? booking.getStartDate().toLocalDate() : null;
            review.setTravelDate(autoDate);
        }
    }

    private void fillFlightMetadata(ReviewComment review, Flight flight) {
        review.setFlightNumber(flight.getFlightNumber());
        review.setAirlineCode(flight.getAirlineCode());
        review.setAirlineName(flight.getAirlineName());
        review.setAirlineLogo(flight.getAirlineLogo());
    }

    private ReviewCommentDTO toDTO(ReviewComment review) {
        ReviewCommentDTO dto = reviewCommentMapper.toDTO(review);
        enrichUserInfo(dto, review.getUserId());
        return dto;
    }

    private List<ReviewCommentDTO> toDTOs(List<ReviewComment> reviews) {
        return reviews.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void enrichUserInfo(ReviewCommentDTO dto, String userId) {
        if (userId == null) {
            return;
        }
        userRepository.findByUserId(userId).ifPresent(user -> {
            String fullName = buildFullName(user.getFirstName(), user.getLastName());
            dto.setUserFullName(fullName != null ? fullName : "");
            dto.setUserAvatar(user.getAvatar());
            dto.setUserCity(user.getCity());
        });
    }

    private String buildFullName(String firstName, String lastName) {
        String f = firstName != null ? firstName.trim() : "";
        String l = lastName != null ? lastName.trim() : "";
        String combined = (f + " " + l).trim();
        return combined.isEmpty() ? null : combined;
    }

    private void recalcTargetAggregates(ReviewTargetType targetType, String targetId) {
        if (targetType == null || targetId == null) {
            return;
        }
        List<ReviewComment> approved = reviewCommentRepository.findAllByTargetTypeAndTargetIdAndStatus(
                targetType, targetId, ReviewStatus.APPROVED);
        if (approved.isEmpty()) {
            updateAggregates(targetType, targetId, null, 0);
            return;
        }
        double avg = approved.stream()
                .filter(r -> r.getRating() != null)
                .mapToDouble(ReviewComment::getRating)
                .average()
                .orElse(0.0);
        updateAggregates(targetType, targetId, BigDecimal.valueOf(avg), approved.size());
    }

    private void updateAggregates(ReviewTargetType targetType, String targetId, BigDecimal avg, int total) {
        switch (targetType) {
            case HOTEL:
                hotelRepository.findById(targetId).ifPresent(hotel -> {
                    hotel.setAverageRating(avg);
                    hotel.setTotalReviews(total);
                    hotelRepository.save(hotel);
                });
                break;
            case CAR:
                carRentalRepository.findById(targetId).ifPresent(car -> {
                    car.setAverageRating(avg);
                    car.setTotalReviews(total);
                    carRentalRepository.save(car);
                });
                break;
            case ACTIVITY:
                activityRepository.findById(targetId).ifPresent(activity -> {
                    activity.setAverageRating(avg);
                    activity.setTotalReviews(total);
                    activityRepository.save(activity);
                });
                break;
            default:
                // For FLIGHT / ALL currently no aggregate targets
                break;
        }
    }

    private void adjustVoteCounters(ReviewComment review, ReviewVote.VoteType type, int delta) {
        if (type == ReviewVote.VoteType.HELPFUL) {
            int current = Optional.ofNullable(review.getHelpfulCount()).orElse(0);
            review.setHelpfulCount(Math.max(0, current + delta));
        } else {
            int current = Optional.ofNullable(review.getNotHelpfulCount()).orElse(0);
            review.setNotHelpfulCount(Math.max(0, current + delta));
        }
    }

    // ==========================================
    // STATISTICS METHODS
    // ==========================================

    public long countByStatus(ReviewStatus status) {
        return reviewCommentRepository.countByStatus(status);
    }

    public java.util.Map<String, Long> getAdminReviewStats() {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("pending", countByStatus(ReviewStatus.PENDING));
        stats.put("approved", countByStatus(ReviewStatus.APPROVED));
        stats.put("rejected", countByStatus(ReviewStatus.REJECTED));
        return stats;
    }

    public List<ReviewCommentDTO> findPendingReviews() {
        List<ReviewComment> pendingReviews = reviewCommentRepository.findByStatus(ReviewStatus.PENDING);
        return pendingReviews.stream()
                .map(reviewCommentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public java.util.Map<String, Object> getVendorStats(String vendorId) {
        List<String> targetIds = new ArrayList<>();
        List<com.wanderlust.api.entity.Hotel> hotels = hotelRepository.findByVendorId(vendorId);
        targetIds.addAll(hotels.stream().map(com.wanderlust.api.entity.Hotel::getHotelID).collect(Collectors.toList()));
        List<com.wanderlust.api.entity.Activity> activities = activityRepository.findByVendorId(vendorId);
        targetIds.addAll(
                activities.stream().map(com.wanderlust.api.entity.Activity::getId).collect(Collectors.toList()));
        List<com.wanderlust.api.entity.CarRental> cars = carRentalRepository.findByVendorId(vendorId);
        targetIds.addAll(cars.stream().map(com.wanderlust.api.entity.CarRental::getId).collect(Collectors.toList()));
        if (targetIds.isEmpty()) {
            java.util.Map<String, Object> emptyStats = new java.util.HashMap<>();
            emptyStats.put("totalReviews", 0L);
            emptyStats.put("averageRating", 0.0);
            emptyStats.put("unrespondedCount", 0L);
            return emptyStats;
        }
        org.springframework.data.mongodb.core.query.Criteria targetCriteria = org.springframework.data.mongodb.core.query.Criteria
                .where("targetId").in(targetIds);
        long totalReviews = mongoTemplate.count(new org.springframework.data.mongodb.core.query.Query(targetCriteria),
                ReviewComment.class);
        org.springframework.data.mongodb.core.query.Criteria unrespondedCriteria = new org.springframework.data.mongodb.core.query.Criteria()
                .andOperator(targetCriteria,
                        new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                                org.springframework.data.mongodb.core.query.Criteria.where("vendorResponse").is(null),
                                org.springframework.data.mongodb.core.query.Criteria.where("vendorResponse").is("")));
        long unrespondedCount = mongoTemplate
                .count(new org.springframework.data.mongodb.core.query.Query(unrespondedCriteria), ReviewComment.class);
        org.springframework.data.mongodb.core.aggregation.Aggregation aggregation = org.springframework.data.mongodb.core.aggregation.Aggregation
                .newAggregation(org.springframework.data.mongodb.core.aggregation.Aggregation.match(targetCriteria),
                        org.springframework.data.mongodb.core.aggregation.Aggregation.group().avg("rating")
                                .as("avgRating"));
        org.springframework.data.mongodb.core.aggregation.AggregationResults<java.util.Map> results = mongoTemplate
                .aggregate(aggregation, ReviewComment.class, java.util.Map.class);
        double averageRating = 0.0;
        java.util.Map<String, Object> result = results.getUniqueMappedResult();
        if (result != null && result.get("avgRating") != null) {
            averageRating = ((Number) result.get("avgRating")).doubleValue();
        }
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalReviews", totalReviews);
        stats.put("averageRating", averageRating);
        stats.put("unrespondedCount", unrespondedCount);
        return stats;
    }

}
