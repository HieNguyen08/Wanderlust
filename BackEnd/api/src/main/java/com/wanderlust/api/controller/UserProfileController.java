package com.wanderlust.api.controller;

import com.wanderlust.api.dto.ChangePasswordDTO; // DTO MỚI
import com.wanderlust.api.dto.MembershipInfoDTO; // DTO MỚI
import com.wanderlust.api.dto.UserProfileResponseDTO; // DTO MỚI
import com.wanderlust.api.dto.UserProfileUpdateDTO;
import com.wanderlust.api.dto.UserStatsDTO; // DTO MỚI
import com.wanderlust.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserProfileController {

    private final UserService userService;

    @Autowired
    public UserProfileController(UserService userService) {
        this.userService = userService;
    }

    // 1. LẤY THÔNG TIN USER HIỆN TẠI (cho Header, ProfilePage)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            UserProfileResponseDTO userProfile = userService.getCurrentUserProfile(userDetails.getUsername());
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 2. CẬP NHẬT THÔNG TIN CÁ NHÂN (cho ProfilePage - Edit mode)
    @PutMapping("/me/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UserProfileUpdateDTO updateDTO) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            UserProfileResponseDTO updatedUser = userService.updateUserProfile(userDetails.getUsername(), updateDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 3. LẤY THỐNG KÊ USER (Trips, Points, Reviews cho ProfilePage stats)
    @GetMapping("/me/stats")
    public ResponseEntity<?> getUserStats(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            UserStatsDTO stats = userService.getUserStats(userDetails.getUsername());
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    // 4. LẤY THÔNG TIN MEMBERSHIP (Gold/Platinum progress bar)
    @GetMapping("/me/membership")
    public ResponseEntity<?> getMembershipInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            MembershipInfoDTO membershipInfo = userService.getMembershipInfo(userDetails.getUsername());
            return new ResponseEntity<>(membershipInfo, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 5. ĐỔI MẬT KHẨU (cho SettingsPage)
    @PutMapping("/me/password") // Thay đổi từ POST sang PUT và đổi DTO
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody ChangePasswordDTO passwordDTO) { // Dùng DTO mới
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        
        // Validate mật khẩu mới
        if (passwordDTO.getNewPassword() == null || passwordDTO.getNewPassword().length() < 6) {
            return new ResponseEntity<>("New password must be at least 6 characters", HttpStatus.BAD_REQUEST);
        }
        if (!passwordDTO.getNewPassword().equals(passwordDTO.getConfirmPassword())) {
            return new ResponseEntity<>("New passwords do not match", HttpStatus.BAD_REQUEST);
        }

        try {
            userService.changeUserPassword(
                userDetails.getUsername(),
                passwordDTO.getCurrentPassword(), // Đổi tên từ oldPassword
                passwordDTO.getNewPassword()
            );
            return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 6. YÊU CẦU NÂNG CẤP VAI TRÒ (Giữ lại từ ProfileController cũ)
    @PostMapping("/me/request-partner-role")
    public ResponseEntity<String> requestPartnerRole(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            userService.requestPartnerRole(userDetails.getUsername());
            return new ResponseEntity<>("Partner role request submitted. An admin will review it.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 cho lỗi nghiệp vụ
        }
    }
    
    // 7. CẬP NHẬT AVATAR (upload file) - (Chưa implement, cần service xử lý file)
    // @PostMapping("/me/avatar")
    
    // 8. CẬP NHẬT CÀI ĐẶT THÔNG BÁO (cho SettingsPage) - (Chưa implement, cần DTO/Entity)
    // @PutMapping("/me/notification-settings")

}