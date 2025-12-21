package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wanderlust.api.dto.reviewComment.ReviewCommentAdminUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentCreateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentUpdateDTO;
import com.wanderlust.api.dto.reviewComment.ReviewCommentVendorResponseDTO;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.ReviewStatus;
import com.wanderlust.api.entity.types.ReviewTargetType;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.entity.ReviewVote;
import com.wanderlust.api.mapper.ReviewCommentMapper;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.ReviewCommentRepository;
import com.wanderlust.api.repository.ReviewVoteRepository;
import com.wanderlust.api.repository.UserRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.FlightRepository;

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
    public List<ReviewCommentDTO> findAllApprovedByTarget(ReviewTargetType targetType, String targetId) {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByTargetTypeAndTargetIdAndStatus(
                targetType, targetId, ReviewStatus.APPROVED);
        return toDTOs(reviews);
    }

    /**
     * [PUBLIC] Lấy tất cả review ĐÃ DUYỆT theo loại (FLIGHT, HOTEL...) không cần
     * targetId cụ thể
     * Sắp xếp theo rating từ cao đến thấp
     */
    public List<ReviewCommentDTO> findAllApprovedByType(ReviewTargetType targetType) {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByTargetTypeAndStatus(
                targetType, ReviewStatus.APPROVED);

        // Sắp xếp theo rating từ cao đến thấp, null cuối cùng
        reviews.sort((r1, r2) -> {
            Double rating1 = r1.getRating() != null ? r1.getRating() : 0.0;
            Double rating2 = r2.getRating() != null ? r2.getRating() : 0.0;
            return rating2.compareTo(rating1); // Giảm dần
        });

        return toDTOs(reviews);
    }

    // ==========================================
    // USER METHODS
    // ==========================================

    /**
     * [USER] Lấy tất cả review của user đang đăng nhập
     */
    public List<ReviewCommentDTO> findAllByUserId(String userId) {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByUserId(userId);
        return toDTOs(reviews);
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
    public List<ReviewCommentDTO> findAllForAdmin() {
        List<ReviewComment> reviews = reviewCommentRepository.findAll();
        return toDTOs(reviews);
    }

    /**
     * [ADMIN] Lấy tất cả review đang chờ duyệt
     */
    public List<ReviewCommentDTO> findAllPending() {
        List<ReviewComment> reviews = reviewCommentRepository.findAllByStatus(ReviewStatus.PENDING);
        return toDTOs(reviews);
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
        return toDTOs(reviews);
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
}