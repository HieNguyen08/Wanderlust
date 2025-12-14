package com.wanderlust.api.services;

import com.wanderlust.api.dto.carRental.CarPriceCalculationDTO;
import com.wanderlust.api.dto.carRental.CarPriceResponseDTO;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.CarStatus;
import com.wanderlust.api.entity.types.ApprovalStatus;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarRentalService {

    private final CarRentalRepository carRentalRepository;
    private final BookingRepository bookingRepository;
    private final MongoTemplate mongoTemplate;
    private final com.wanderlust.api.repository.LocationRepository locationRepository;

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

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> authority.equals(a.getAuthority()));
    }

    // --- Basic CRUD ---

    public List<CarRental> findAll() {
        return carRentalRepository.findAll();
    }

    public CarRental findById(String id) {
        CarRental car = carRentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CarRental not found with id " + id));
        if (car.getApprovalStatus() != ApprovalStatus.APPROVED || car.getStatus() != CarStatus.AVAILABLE) {
            throw new RuntimeException("CarRental not available");
        }
        return car;
    }

    public CarRental findByIdForManagement(String id) {
        return carRentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CarRental not found with id " + id));
    }

    public CarRental create(CarRental carRental) {
        carRental.setCreatedAt(LocalDateTime.now());
        carRental.setUpdatedAt(LocalDateTime.now());
        carRental.setStatus(CarStatus.PENDING_REVIEW);
        carRental.setApprovalStatus(ApprovalStatus.PENDING);
        if (carRental.getAvailableQuantity() == null) {
            carRental.setAvailableQuantity(1);
        }

        enrichLocation(carRental);

        return carRentalRepository.save(carRental);
    }

    public CarRental save(CarRental carRental) {
        carRental.setUpdatedAt(LocalDateTime.now());

        if (carRental.getAvailableQuantity() == null) {
            carRental.setAvailableQuantity(1);
        }

        enrichLocation(carRental);

        return carRentalRepository.save(carRental);
    }

    private void enrichLocation(CarRental carRental) {
        if (carRental.getLocationId() != null) {
            com.wanderlust.api.entity.Location loc = locationRepository.findById(carRental.getLocationId())
                    .orElse(null);
            if (loc != null) {
                carRental.setCity(loc.getName());
                if (loc.getParentLocationId() != null) {
                    com.wanderlust.api.entity.Location parent = locationRepository.findById(loc.getParentLocationId())
                            .orElse(null);
                    if (parent != null) {
                        carRental.setCountry(parent.getName());
                    }
                }
            }
        }
    }

    public void delete(String id) {
        if (!carRentalRepository.existsById(id)) {
            throw new RuntimeException("CarRental not found with id " + id);
        }
        carRentalRepository.deleteById(id);
    }

    public List<CarRental> findByLocationId(String locationId) {
        return carRentalRepository.findByLocationId(locationId);
    }

    public List<CarRental> findByVendorId(String vendorId) {
        return carRentalRepository.findByVendorId(vendorId);
    }

    // --- Advanced Features ---

    public List<CarRental> searchCars(String locationId, String brand, String type, BigDecimal minPrice,
            BigDecimal maxPrice) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (locationId != null && !locationId.isEmpty()) {
            criteriaList.add(Criteria.where("locationId").is(locationId));
        }
        if (brand != null && !brand.isEmpty()) {
            criteriaList.add(Criteria.where("brand").regex(brand, "i"));
        }
        if (type != null && !type.isEmpty()) {
            criteriaList.add(Criteria.where("type").is(type));
        }
        if (minPrice != null) {
            criteriaList.add(Criteria.where("pricePerDay").gte(minPrice));
        }
        if (maxPrice != null) {
            criteriaList.add(Criteria.where("pricePerDay").lte(maxPrice));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
        boolean isAdmin = isAuthenticated && hasAuthority(authentication, "ROLE_ADMIN");
        boolean isVendor = isAuthenticated
                && (hasAuthority(authentication, "ROLE_VENDOR") || hasAuthority(authentication, "ROLE_PARTNER"));

        if (isAdmin) {
            // Admin can see all cars regardless of approval/status
        } else if (isVendor) {
            // Vendors/partners see only their own submissions (any status)
            criteriaList.add(Criteria.where("vendorId").is(getCurrentUserId()));
        } else {
            // Public users only see approved + available cars
            criteriaList.add(Criteria.where("status").is(CarStatus.AVAILABLE));
            criteriaList.add(Criteria.where("approvalStatus").is(ApprovalStatus.APPROVED));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, CarRental.class);
    }

    public CarRental approve(String id) {
        CarRental car = findByIdForManagement(id);
        car.setApprovalStatus(ApprovalStatus.APPROVED);
        car.setStatus(CarStatus.AVAILABLE);
        car.setUpdatedAt(LocalDateTime.now());
        car.setAdminNote(null);
        return carRentalRepository.save(car);
    }

    public CarRental reject(String id, String reason) {
        CarRental car = findByIdForManagement(id);
        car.setApprovalStatus(ApprovalStatus.REJECTED);
        car.setStatus(CarStatus.REJECTED);
        car.setUpdatedAt(LocalDateTime.now());
        car.setAdminNote(reason);
        return carRentalRepository.save(car);
    }

    public CarRental requestRevision(String id, String reason) {
        CarRental car = findByIdForManagement(id);
        car.setApprovalStatus(ApprovalStatus.PENDING);
        car.setStatus(CarStatus.PENDING_REVIEW);
        car.setUpdatedAt(LocalDateTime.now());
        car.setAdminNote(reason);
        return carRentalRepository.save(car);
    }

    public CarRental pause(String id) {
        CarRental car = findByIdForManagement(id);
        car.setStatus(CarStatus.PAUSED);
        car.setUpdatedAt(LocalDateTime.now());
        return carRentalRepository.save(car);
    }

    public CarRental resume(String id) {
        CarRental car = findByIdForManagement(id);
        if (car.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("Cannot resume a car that is not approved");
        }
        car.setStatus(CarStatus.AVAILABLE);
        car.setUpdatedAt(LocalDateTime.now());
        return carRentalRepository.save(car);
    }

    public List<CarRental> findPopularCars() {
        Query query = new Query();
        query.with(Sort.by(Sort.Direction.DESC, "totalTrips"));
        query.limit(10);
        return mongoTemplate.find(query, CarRental.class);
    }

    /**
     * Check Availability (Đã tích hợp với Booking Repository)
     */
    public boolean checkAvailability(String carId, LocalDateTime startDate, LocalDateTime endDate) {
        // 1. Kiểm tra trạng thái của xe (bảo trì, v.v.)
        CarRental car = findById(carId);
        if (car.getStatus() != CarStatus.AVAILABLE) {
            return false;
        }

        // 2. Chuyển sang LocalDate vì Booking entity dùng LocalDate
        LocalDate requestedStartDate = startDate.toLocalDate();
        LocalDate requestedEndDate = endDate.toLocalDate();

        // 3. Định nghĩa các trạng thái booking "chặn" lịch
        List<BookingStatus> activeStatuses = List.of(
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED);

        // 4. Query các booking bị trùng lặp
        List<Booking> conflicts = bookingRepository.findConflictingCarBookings(
                carId,
                requestedStartDate,
                requestedEndDate,
                activeStatuses);

        // 5. Nếu list rỗng -> không có trùng lặp -> Available
        return conflicts.isEmpty();
    }

    /**
     * Calculate Rental Price
     */
    public CarPriceResponseDTO calculatePrice(String carId, CarPriceCalculationDTO calcRequest) {
        CarRental car = findById(carId);

        // Tính toán dựa trên LocalDateTime
        long days = Duration.between(calcRequest.getStartDate(), calcRequest.getEndDate()).toDays();
        if (days < 1)
            days = 1; // Tối thiểu 1 ngày

        BigDecimal baseTotal = car.getPricePerDay().multiply(BigDecimal.valueOf(days));

        BigDecimal driverFee = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(calcRequest.getWithDriver()) && Boolean.TRUE.equals(car.getWithDriver())) {
            BigDecimal dPrice = car.getDriverPrice() != null ? car.getDriverPrice() : BigDecimal.ZERO;
            driverFee = dPrice.multiply(BigDecimal.valueOf(days));
        }

        BigDecimal serviceFee = baseTotal.multiply(BigDecimal.valueOf(0.05)); // 5% phí dịch vụ
        BigDecimal grandTotal = baseTotal.add(driverFee).add(serviceFee);

        // Sử dụng builder như code bạn cung cấp
        return CarPriceResponseDTO.builder()
                .basePrice(baseTotal)
                .driverFee(driverFee)
                .serviceFee(serviceFee)
                .totalPrice(grandTotal)
                .totalDays((int) days)
                .build();
    }
}