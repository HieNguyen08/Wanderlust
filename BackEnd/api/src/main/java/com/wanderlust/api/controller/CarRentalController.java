package com.wanderlust.api.controller;

import com.wanderlust.api.dto.carRental.CarPriceCalculationDTO;
import com.wanderlust.api.dto.carRental.CarPriceResponseDTO;
import com.wanderlust.api.dto.carRental.CarRentalDTO;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.mapper.CarRentalMapper;
import com.wanderlust.api.services.CarRentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Thêm import
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/car-rentals")
@RequiredArgsConstructor
public class CarRentalController {

    private final CarRentalService carRentalService;
    private final CarRentalMapper carRentalMapper;

    // --- PUBLIC GET ENDPOINTS ---

    @GetMapping
    public ResponseEntity<List<CarRentalDTO>> searchCarRentals(
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<CarRental> cars = carRentalService.searchCars(locationId, brand, type, minPrice, maxPrice);
        return ResponseEntity.ok(carRentalMapper.toDTOs(cars));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<CarRentalDTO>> getPopularCars() {
        List<CarRental> cars = carRentalService.findPopularCars();
        return ResponseEntity.ok(carRentalMapper.toDTOs(cars));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarRentalDTO> getCarRentalById(@PathVariable String id) {
        CarRental car = carRentalService.findById(id);
        return ResponseEntity.ok(carRentalMapper.toDTO(car));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<?> checkAvailability(
            @PathVariable String id,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            boolean isAvailable = carRentalService.checkAvailability(id, start, end);
            return ResponseEntity.ok(isAvailable);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format or booking check error");
        }
    }

    @PostMapping("/{id}/calculate-price")
    public ResponseEntity<CarPriceResponseDTO> calculatePrice(
            @PathVariable String id,
            @RequestBody CarPriceCalculationDTO request
    ) {
        CarPriceResponseDTO response = carRentalService.calculatePrice(id, request);
        return ResponseEntity.ok(response);
    }

    // --- SECURED ADMIN/PARTNER ENDPOINTS ---

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<CarRentalDTO> createCarRental(
            @RequestBody CarRentalDTO carRentalDTO,
            Authentication authentication // Thêm Authentication
    ) {
        CarRental entity = carRentalMapper.toEntity(carRentalDTO);

        // Tự động gán vendorId bằng ID của user (partner) đang đăng nhập
        String currentUserId = authentication.getName();
        entity.setVendorId(currentUserId);

        CarRental created = carRentalService.create(entity);
        return new ResponseEntity<>(carRentalMapper.toDTO(created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<CarRentalDTO> updateCarRental(
            @PathVariable String id,
            @RequestBody CarRentalDTO carRentalDTO
    ) {
        CarRental existingCar = carRentalService.findById(id);
        carRentalMapper.updateEntityFromDTO(carRentalDTO, existingCar);
        CarRental updated = carRentalService.save(existingCar);
        return ResponseEntity.ok(carRentalMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<String> deleteCarRental(@PathVariable String id) {
        carRentalService.delete(id);
        return ResponseEntity.ok("Car rental has been deleted successfully!");
    }
}