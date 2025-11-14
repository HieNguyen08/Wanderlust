package com.wanderlust.api.services;

import com.wanderlust.api.dto.carRental.CarPriceCalculationDTO;
import com.wanderlust.api.dto.carRental.CarPriceResponseDTO;
import com.wanderlust.api.entity.Booking; // Thêm import
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.types.BookingStatus; // Thêm import
import com.wanderlust.api.entity.types.CarStatus;
import com.wanderlust.api.repository.BookingRepository; // Thêm import
import com.wanderlust.api.repository.CarRentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate; // Thêm import
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List; // Thêm import

@Service
@RequiredArgsConstructor
public class CarRentalService {

    private final CarRentalRepository carRentalRepository;
    private final BookingRepository bookingRepository; // Thêm dependency
    private final MongoTemplate mongoTemplate;

    // --- Basic CRUD ---

    public List<CarRental> findAll() {
        return carRentalRepository.findAll();
    }

    public CarRental findById(String id) {
        return carRentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CarRental not found with id " + id));
    }

    public CarRental create(CarRental carRental) {
        carRental.setCreatedAt(LocalDateTime.now());
        carRental.setUpdatedAt(LocalDateTime.now());
        carRental.setStatus(CarStatus.AVAILABLE);
        return carRentalRepository.save(carRental);
    }

    public CarRental save(CarRental carRental) {
        carRental.setUpdatedAt(LocalDateTime.now());
        return carRentalRepository.save(carRental);
    }

    public void delete(String id) {
        if (!carRentalRepository.existsById(id)) {
            throw new RuntimeException("CarRental not found with id " + id);
        }
        carRentalRepository.deleteById(id);
    }

    // --- Advanced Features ---

    public List<CarRental> searchCars(String locationId, String brand, String type, BigDecimal minPrice, BigDecimal maxPrice) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("status").is(CarStatus.AVAILABLE));

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

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, CarRental.class);
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
                BookingStatus.CONFIRMED
        );

        // 4. Query các booking bị trùng lặp
        List<Booking> conflicts = bookingRepository.findConflictingCarBookings(
                carId,
                requestedStartDate,
                requestedEndDate,
                activeStatuses
        );

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
        if (days < 1) days = 1; // Tối thiểu 1 ngày

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