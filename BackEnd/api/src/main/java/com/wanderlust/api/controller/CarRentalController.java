package com.wanderlust.api.controller;

import com.wanderlust.api.dto.carRental.CarPriceCalculationDTO;
import com.wanderlust.api.dto.carRental.CarPriceResponseDTO;
import com.wanderlust.api.dto.carRental.CarRentalDTO;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.mapper.CarRentalMapper;
import com.wanderlust.api.services.CarRentalService;
import com.wanderlust.api.services.CustomOAuth2User;
import com.wanderlust.api.services.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    private String getUserIdFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userId;
        if (principal instanceof CustomUserDetails) {
            userId = ((CustomUserDetails) principal).getUserID();
        } else if (principal instanceof CustomOAuth2User) {
            userId = ((CustomOAuth2User) principal).getUser().getUserId();
        } else {
            throw new IllegalStateException("Invalid principal type.");
        }
        if (userId == null) {
            throw new SecurityException("User ID is null in principal.");
        }
        return userId;
    }

    @GetMapping
    public ResponseEntity<List<CarRentalDTO>> searchCarRentals(
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        List<CarRental> cars = carRentalService.searchCars(locationId, brand, type, minPrice, maxPrice);
        return ResponseEntity.ok(carRentalMapper.toDTOs(cars));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<CarRentalDTO>> getPopularCars() {
        List<CarRental> cars = carRentalService.findPopularCars();
        return ResponseEntity.ok(carRentalMapper.toDTOs(cars));
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<CarRentalDTO>> getCarsByLocation(@PathVariable String locationId) {
        List<CarRental> cars = carRentalService.findByLocationId(locationId);
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
            @RequestParam String endDate) {
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CarPriceResponseDTO> calculatePrice(
            @PathVariable String id,
            @RequestBody CarPriceCalculationDTO request) {
        CarPriceResponseDTO response = carRentalService.calculatePrice(id, request);
        return ResponseEntity.ok(response);
    }

    // --- SECURED ADMIN/PARTNER ENDPOINTS ---

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<CarRentalDTO> createCarRental(
            @RequestBody CarRentalDTO carRentalDTO,
            Authentication authentication) {
        CarRental entity = carRentalMapper.toEntity(carRentalDTO);

        // Tự động gán vendorId bằng ID của user (partner) đang đăng nhập
        String currentUserId = getUserIdFromAuthentication(authentication);
        entity.setVendorId(currentUserId);

        CarRental created = carRentalService.create(entity);
        return new ResponseEntity<>(carRentalMapper.toDTO(created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<CarRentalDTO> updateCarRental(
            @PathVariable String id,
            @RequestBody CarRentalDTO carRentalDTO) {
        CarRental existingCar = carRentalService.findByIdForManagement(id);
        carRentalMapper.updateEntityFromDTO(carRentalDTO, existingCar);
        CarRental updated = carRentalService.save(existingCar);
        return ResponseEntity.ok(carRentalMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<String> deleteCarRental(@PathVariable String id) {
        carRentalService.delete(id);
        return ResponseEntity.ok("Car rental has been deleted successfully!");
    }

    // --- APPROVAL & OPERATIONAL STATUS ---

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarRentalDTO> approve(@PathVariable String id) {
        return ResponseEntity.ok(carRentalMapper.toDTO(carRentalService.approve(id)));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarRentalDTO> reject(@PathVariable String id, @RequestBody(required = false) java.util.Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(carRentalMapper.toDTO(carRentalService.reject(id, reason)));
    }

    @PostMapping("/{id}/request-revision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarRentalDTO> requestRevision(@PathVariable String id, @RequestBody(required = false) java.util.Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(carRentalMapper.toDTO(carRentalService.requestRevision(id, reason)));
    }

    @PostMapping("/{id}/pause")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<CarRentalDTO> pause(@PathVariable String id) {
        return ResponseEntity.ok(carRentalMapper.toDTO(carRentalService.pause(id)));
    }

    @PostMapping("/{id}/resume")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VENDOR') and @webSecurity.isCarRentalOwner(authentication, #id))")
    public ResponseEntity<CarRentalDTO> resume(@PathVariable String id) {
        return ResponseEntity.ok(carRentalMapper.toDTO(carRentalService.resume(id)));
    }
}