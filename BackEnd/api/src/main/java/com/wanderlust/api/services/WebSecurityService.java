package com.wanderlust.api.services;

// Import Entities
import java.util.Optional;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.Advertisement;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Hotel; // <-- BỔ SUNG
import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.entity.ReviewComment;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.TravelGuide;
import com.wanderlust.api.entity.WalletTransaction;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.AdvertisementRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.HotelRepository; // <-- BỔ SUNG
import com.wanderlust.api.repository.PaymentRepository;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.repository.ReviewCommentRepository;
import com.wanderlust.api.repository.RoomRepository;
import com.wanderlust.api.repository.TravelGuideRepository;
import com.wanderlust.api.repository.WalletTransactionRepository; // <-- BỔ SUNG

import lombok.RequiredArgsConstructor;

/**
 * Dịch vụ bảo mật dùng trong @PreAuthorize để kiểm tra quyền sở hữu tài nguyên.
 * Tên bean là "webSecurity".
 */
@Service("webSecurity")
@RequiredArgsConstructor
public class WebSecurityService {

    // Inject tất cả các repository cần thiết
    private final ActivityRepository activityRepository;
    private final AdvertisementRepository advertisementRepository;
    private final BookingRepository bookingRepository;
    private final CarRentalRepository carRentalRepository;
    private final HotelRepository hotelRepository;
    private final PaymentRepository paymentRepository;
    private final PromotionRepository promotionRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final TravelGuideRepository travelGuideRepository;
    private final RoomRepository roomRepository;
    private final WalletTransactionRepository transactionRepository;

    /**
     * Lấy User ID (String) từ đối tượng Authentication (CustomUserDetails hoặc CustomOAuth2User).
     */
    private String getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserID();
        } else if (principal instanceof CustomOAuth2User) {
            return ((CustomOAuth2User) principal).getUser().getUserId();
        } else {
            return authentication.getName();
        }
    }

    /**
     * (PARTNER) Kiểm tra PARTNER có sở hữu Activity không (dựa trên vendorId).
     */
    public boolean isActivityOwner(Authentication authentication, String activityId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return activityRepository.findById(activityId)
                .map(Activity::getVendorId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (PARTNER) Kiểm tra PARTNER có sở hữu Advertisement không (dựa trên vendorId).
     */
    public boolean isAdvertisementOwner(Authentication authentication, String advertisementId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return advertisementRepository.findById(advertisementId)
                .map(Advertisement::getVendorId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (USER) Kiểm tra USER (khách hàng) có sở hữu Booking không (dựa trên userId).
     */
    public boolean isBookingOwner(Authentication authentication, String bookingId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return bookingRepository.findById(bookingId)
                .map(Booking::getUserId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (PARTNER) Kiểm tra PARTNER có phải là nhà cung cấp của Booking không (dựa trên vendorId).
     */
    public boolean isBookingVendor(Authentication authentication, String bookingId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return bookingRepository.findById(bookingId)
                .map(Booking::getVendorId)
                .map(vendorId -> vendorId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (PARTNER) Kiểm tra PARTNER có sở hữu CarRental không (dựa trên vendorId).
     */
    public boolean isCarRentalOwner(Authentication authentication, String carRentalId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return carRentalRepository.findById(carRentalId)
                .map(CarRental::getVendorId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (PARTNER) Kiểm tra PARTNER có sở hữu Hotel không (dựa trên vendorId).
     */
    public boolean isHotelOwner(Authentication authentication, String hotelId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null || hotelId == null) return false;
        
        return hotelRepository.findById(hotelId)
                .map(Hotel::getVendorId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (USER) Kiểm tra USER có sở hữu Payment không (dựa trên userId).
     */
    public boolean isPaymentOwner(Authentication authentication, String paymentId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return paymentRepository.findById(paymentId)
                .map(Payment::getUserId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    // =================================================================
    // BỔ SUNG PHƯƠNG THỨC MỚI
    // =================================================================
    /**
     * (PARTNER) Kiểm tra PARTNER có sở hữu Room không
     * Bằng cách kiểm tra xem họ có sở hữu Hotel chứa Room đó không.
     */
    public boolean isRoomOwner(Authentication authentication, String roomId) {
        
        // 1. Tìm Room bằng roomId
        Optional<Room> roomOptional = roomRepository.findById(roomId);
        
        if (roomOptional.isEmpty()) {
            return false; // Không tìm thấy phòng
        }

        // 2. Lấy hotelId từ Room
        String hotelId = roomOptional.get().getHotelId();

        // 3. Tái sử dụng logic isHotelOwner.
        //    Phương thức này sẽ tự động kiểm tra (authentication) với hotelId.
        return this.isHotelOwner(authentication, hotelId);
    }
    // =================================================================

    /**
     * (USER) Kiểm tra USER có sở hữu ReviewComment không (dựa trên userId).
     */
    public boolean isReviewCommentOwner(Authentication authentication, String reviewCommentId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return reviewCommentRepository.findById(reviewCommentId)
                .map(ReviewComment::getUserId)
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (PARTNER/ADMIN) Kiểm tra PARTNER/ADMIN có sở hữu TravelGuide không (dựa trên authorId).
     */
    public boolean isTravelGuideOwner(Authentication authentication, String travelGuideId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return travelGuideRepository.findById(travelGuideId)
                .map(TravelGuide::getAuthorId)
                .map(authorId -> authorId.equals(currentUserId))
                .orElse(false);
    }

    public boolean isTransactionOwner(Authentication authentication, String transactionId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return transactionRepository.findById(transactionId)
                .map(WalletTransaction::getUserId) // Lấy userId từ transaction
                .map(ownerId -> ownerId.equals(currentUserId))
                .orElse(false); // Trả về false nếu không tìm thấy transaction
    }

    /**
     * (PARTNER) Kiểm tra PARTNER có sở hữu Promotion không (dựa trên vendorId).
     */
    public boolean isPromotionOwner(Authentication authentication, String promotionId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) return false;
        
        return promotionRepository.findById(promotionId)
                .map(Promotion::getVendorId)
                .map(vendorId -> vendorId != null && vendorId.equals(currentUserId))
                .orElse(false);
    }

    /**
     * (Chung) Kiểm tra xem ID người dùng target có phải là người dùng hiện tại không.
     */
    public boolean isCurrentUser(Authentication authentication, String targetUserId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        return currentUserId != null && currentUserId.equals(targetUserId);
    }
}