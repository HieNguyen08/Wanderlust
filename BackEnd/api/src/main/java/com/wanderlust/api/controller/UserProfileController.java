package com.wanderlust.api.controller;

import com.wanderlust.api.dto.ChangePasswordDTO;
import com.wanderlust.api.dto.MembershipInfoDTO;
import com.wanderlust.api.dto.UserProfileResponseDTO;
import com.wanderlust.api.dto.UserProfileUpdateDTO;
import com.wanderlust.api.dto.UserStatsDTO;
import com.wanderlust.api.dto.NotificationSettingsDTO;
import com.wanderlust.api.services.UserProfileService;
import com.wanderlust.api.services.CustomUserDetails;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("isAuthenticated()")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    // <<< XÓA BỎ HÀM getUsername(UserDetails userDetails) TẠI ĐÂY

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            UserProfileResponseDTO userProfile = userProfileService.getCurrentUserProfile(userDetails.getUserID());
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 2. CẬP NHẬT THÔNG TIN CÁ NHÂN
    @PutMapping("/me/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserProfileUpdateDTO updateDTO) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            UserProfileResponseDTO updatedUser = userProfileService.updateUserProfile(userDetails.getUserID(), updateDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 3. LẤY THỐNG KÊ USER
    @GetMapping("/me/stats")
    public ResponseEntity<?> getUserStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            UserStatsDTO stats = userProfileService.getUserStats(userDetails.getUserID());
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    // 4. LẤY THÔNG TIN MEMBERSHIP
    @GetMapping("/me/membership")
    public ResponseEntity<?> getMembershipInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            MembershipInfoDTO membershipInfo = userProfileService.getMembershipInfo(userDetails.getUserID());
            return new ResponseEntity<>(membershipInfo, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 5. ĐỔI MẬT KHẨU
    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ChangePasswordDTO passwordDTO) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        
        if (passwordDTO.getNewPassword() == null || !passwordDTO.getNewPassword().equals(passwordDTO.getConfirmPassword())) {
            return new ResponseEntity<>("New passwords do not match", HttpStatus.BAD_REQUEST);
        }

        try {
            userProfileService.changePassword(
                userDetails.getUserID(),
                passwordDTO
            );
            return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    // // 6. CẬP NHẬT AVATAR (upload file)
    // @PostMapping("/me/avatar")
    // public ResponseEntity<?> uploadAvatar(
    //         @AuthenticationPrincipal CustomUserDetails userDetails, // <<< THAY ĐỔI
    //         @RequestParam("file") MultipartFile file) {
    //     // ... (logic)
    //     // String fileUrl = userProfileService.uploadAvatar(userDetails.getUserID(), file); // <<< THAY ĐỔI
    //     // ...
    // }

    // 7. LẤY CÀI ĐẶT THÔNG BÁO
    @GetMapping("/me/notification-settings")
    public ResponseEntity<?> getNotificationSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            NotificationSettingsDTO settings = userProfileService.getNotificationSettings(userDetails.getUserID());
            return new ResponseEntity<>(settings, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    // 8. CẬP NHẬT CÀI ĐẶT THÔNG BÁO
    @PutMapping("/me/notification-settings")
    public ResponseEntity<?> updateNotificationSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody NotificationSettingsDTO settingsDTO) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            userProfileService.updateNotificationSettings(userDetails.getUserID(), settingsDTO);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    // 9. YÊU CẦU NÂNG CẤP VAI TRÒ
    @PostMapping("/me/request-partner-role")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> requestPartnerRole(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            userProfileService.requestPartnerRole(userDetails.getUserID());
            return new ResponseEntity<>("Partner role request submitted. An admin will review it.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}