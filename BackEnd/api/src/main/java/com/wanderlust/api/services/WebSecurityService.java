package com.wanderlust.api.services;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.entity.Advertisement;
import com.wanderlust.api.repository.AdvertisementRepository;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.repository.FlightRepository;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.entity.Location;
import com.wanderlust.api.repository.LocationRepository;
import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.repository.PaymentRepository;
import com.wanderlust.api.entity.Promotion;
import com.wanderlust.api.repository.PromotionRepository;
import com.wanderlust.api.entity.ReviewComment;

import com.wanderlust.api.repository.ReviewCommentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.stereotype.Service;


@Service("webSecurity") 
@RequiredArgsConstructor
public class WebSecurityService {

    private final ActivityRepository activityRepository;
    private final AdvertisementRepository advertisementRepository;
    private final BookingRepository bookingRepository;
    private final CarRentalRepository carRentalRepository;
    private final HotelRepository hotelRepository;
    private final FlightRepository flightRepository;
    private final LocationRepository locationRepository;
    private final PaymentRepository paymentRepository;
    private final PromotionRepository promotionRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    



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
            throw new IllegalStateException("Unknown principal type: " + principal.getClass().getName());
        }
    }

    

    public boolean isActivityOwner(Authentication authentication, String activityId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Activity activity = activityRepository.findById(activityId).orElse(null);
        if (activity == null) {
            return false;
        }
        return activity.getUserId() != null && activity.getUserId().equals(currentUserId);
    }
    
    public boolean isAdvertisementOwner(Authentication authentication, String advertisementId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Advertisement advertisement = advertisementRepository.findById(advertisementId).orElse(null);
        if (advertisement == null) {
            return false;
        }
        return advertisement.getUserId() != null && advertisement.getUserId().equals(currentUserId);
    }

    public boolean isBookingOwner(Authentication authentication, String bookingId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return false;
        }
        return booking.getUserId() != null && booking.getUserId().equals(currentUserId);
    }

    public boolean isCarRentalOwner(Authentication authentication, String carRentalId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        CarRental carRental = carRentalRepository.findById(carRentalId).orElse(null);
        if (carRental == null) {
            return false;
        }
        return carRental.getUserId() != null && carRental.getUserId().equals(currentUserId);
    }

    public boolean isHotelOwner(Authentication authentication, String hotelId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel == null) {
            return false;
        }
        return hotel.getUserId() != null && hotel.getUserId().equals(currentUserId);
    }

    public boolean isFlightOwner(Authentication authentication, String flightId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return false;
        }
        // Flights are system data, not user-created, so only admins can manage
        return false;
    }

    public boolean isLocationOwner(Authentication authentication, String locationId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Location location = locationRepository.findById(locationId).orElse(null);
        if (location == null) {
            return false;
        }
        return location.getUserId() != null && location.getUserId().equals(currentUserId);
    }

    public boolean isPaymentOwner(Authentication authentication, String paymentId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return false;
        }
        return payment.getUserId() != null && payment.getUserId().equals(currentUserId);
    }


    public boolean isPromotionOwner(Authentication authentication, String promotionId) {
        // Promotions are public, no ownership check needed
        // Only admins should be able to modify promotions (handled by @PreAuthorize)
        return false;
    }

    public boolean isReviewCommentOwner(Authentication authentication, String reviewCommentId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        if (currentUserId == null) {
            return false;
        }
        ReviewComment reviewComment = reviewCommentRepository.findById(reviewCommentId).orElse(null);
        if (reviewComment == null) {
            return false;
        }
        return reviewComment.getUserId() != null && reviewComment.getUserId().equals(currentUserId);
    }

    public boolean isCurrentUser(Authentication authentication, String targetUserId) {
        String currentUserId = getUserIdFromAuthentication(authentication);
        return currentUserId != null && currentUserId.equals(targetUserId);
    }


}