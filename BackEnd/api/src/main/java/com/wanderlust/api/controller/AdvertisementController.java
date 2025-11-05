package com.wanderlust.api.controller;

import com.wanderlust.api.entity.Advertisement;
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
@RequestMapping("/api/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    // Get all advertisements
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Advertisement>> getAllAdvertisements() {
        List<Advertisement> allAdvertisements = advertisementService.findAll();
        return new ResponseEntity<>(allAdvertisements, HttpStatus.OK);
    }

    // Add an advertisement
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<Advertisement> addAdvertisement(@RequestBody Advertisement advertisement) {
        Advertisement newAdvertisement = advertisementService.create(advertisement);
        return new ResponseEntity<>(newAdvertisement, HttpStatus.CREATED);
    }

    // Update an existing advertisement
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARTNER') and @webSecurity.isAdvertisementOwner(authentication, #id))")
    public ResponseEntity<Advertisement> updateAdvertisement(@PathVariable String id, @RequestBody Advertisement updatedAdvertisement) {
        updatedAdvertisement.setAd_ID(id); // Ensure the ID in the entity matches the path variable
        Advertisement resultAdvertisement = advertisementService.update(updatedAdvertisement);
        return new ResponseEntity<>(resultAdvertisement, HttpStatus.OK);
    }

    // Delete an advertisement by ID
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

    // Delete all advertisements
    @DeleteMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> deleteAllAdvertisements() {
        advertisementService.deleteAll();
        return new ResponseEntity<>("All advertisements have been deleted successfully!", HttpStatus.OK);
    }

    // Get a specific advertisement by id
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Advertisement> getAdvertisementById(@PathVariable String id) {
        Advertisement advertisement = advertisementService.findByID(id);
        return new ResponseEntity<>(advertisement, HttpStatus.OK);
    }
}