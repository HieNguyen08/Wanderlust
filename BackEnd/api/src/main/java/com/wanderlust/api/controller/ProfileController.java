package com.wanderlust.api.controller;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class ProfileController {

    private final UserService userService;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // Get current logged-in user's profile
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // Email from JWT
            
            Optional<User> userOptional = userService.findByEmail(email);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            
            User user = userOptional.get();
            // Remove password from response
            user.setPassword(null);
            
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update current logged-in user's profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(@RequestBody User updatedUser) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // Email from JWT
            
            Optional<User> userOptional = userService.findByEmail(email);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            
            User existingUser = userOptional.get();
            
            // Update only allowed fields
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setMobile(updatedUser.getMobile());
            existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
            existingUser.setGender(updatedUser.getGender());
            existingUser.setAddress(updatedUser.getAddress());
            existingUser.setCity(updatedUser.getCity());
            existingUser.setCountry(updatedUser.getCountry());
            existingUser.setPassportNumber(updatedUser.getPassportNumber());
            existingUser.setPassportExpiryDate(updatedUser.getPassportExpiryDate());
            
            User resultUser = userService.update(existingUser);
            
            // Remove password from response
            resultUser.setPassword(null);
            
            return new ResponseEntity<>(resultUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
