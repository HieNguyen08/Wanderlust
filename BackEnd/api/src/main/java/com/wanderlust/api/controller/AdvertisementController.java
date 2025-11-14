package com.wanderlust.api.controller;

import com.wanderlust.api.dto.advertisement.AdvertisementRequestDTO;
import com.wanderlust.api.dto.advertisement.AdvertisementResponseDTO;
import com.wanderlust.api.entity.types.AdPosition;
import com.wanderlust.api.services.AdvertisementService;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/advertisements") // Giữ nguyên /api/advertisements như file gốc
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    /**
     * Lấy danh sách Ads (có thể filter theo position)
     * API: GET /api/ads?position=... 
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AdvertisementResponseDTO>> getAllAdvertisements(
            @RequestParam(required = false) AdPosition position) {
        List<AdvertisementResponseDTO> allAdvertisements = advertisementService.findAll(position);
        return new ResponseEntity<>(allAdvertisements, HttpStatus.OK);
    }

    /**
     * Lấy chi tiết ad
     * API: GET /api/ads/:id 
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AdvertisementResponseDTO> getAdvertisementById(@PathVariable String id) {
        AdvertisementResponseDTO advertisement = advertisementService.findByID(id);
        return new ResponseEntity<>(advertisement, HttpStatus.OK);
    }

    /**
     * Tạo advertisement mới
     * (Chỉ Admin hoặc Partner)
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<AdvertisementResponseDTO> createAdvertisement(@RequestBody AdvertisementRequestDTO dto) {
        // Trong service thực tế, bạn nên lấy vendorId từ 'Authentication' 
        // nếu role là PARTNER để đảm bảo họ chỉ tạo cho chính mình.
        AdvertisementResponseDTO newAdvertisement = advertisementService.create(dto);
        return new ResponseEntity<>(newAdvertisement, HttpStatus.CREATED);
    }

    /**
     * Cập nhật advertisement
     * (Chỉ Admin hoặc Partner sở hữu)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isAdvertisementOwner(authentication, #id))")
    public ResponseEntity<AdvertisementResponseDTO> updateAdvertisement(@PathVariable String id, @RequestBody AdvertisementRequestDTO dto) {
        AdvertisementResponseDTO updatedAdvertisement = advertisementService.update(id, dto);
        return new ResponseEntity<>(updatedAdvertisement, HttpStatus.OK);
    }

    /**
     * Xóa advertisement
     * (Chỉ Admin hoặc Partner sở hữu)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isAdvertisementOwner(authentication, #id))")
    public ResponseEntity<String> deleteAdvertisement(@PathVariable String id) {
        try {
            advertisementService.delete(id);
            return new ResponseEntity<>("Advertisement has been deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Xóa toàn bộ advertisements
     * (Chỉ Admin)
     */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllAdvertisements() {
        advertisementService.deleteAll();
        return new ResponseEntity<>("All advertisements have been deleted successfully!", HttpStatus.OK);
    }

    /**
     * Track impression
     * API: POST /api/ads/:id/track-impression 
     */
    @PostMapping("/{id}/track-impression")
    @PreAuthorize("permitAll()") // Cho phép public access để tracking
    public ResponseEntity<Void> trackImpression(@PathVariable String id) {
        advertisementService.trackImpression(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Track click
     * API: POST /api/ads/:id/track-click 
     */
    @PostMapping("/{id}/track-click")
    @PreAuthorize("permitAll()") // Cho phép public access để tracking
    public ResponseEntity<Void> trackClick(@PathVariable String id) {
        advertisementService.trackClick(id);
        return ResponseEntity.ok().build();
    }
}