package com.wanderlust.api.controller;

import com.wanderlust.api.dto.PasswordChangeDTO;
import com.wanderlust.api.dto.UserProfileUpdateDTO;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/profile") // API dành riêng cho user quản lý profile của mình
public class ProfileController {

    private final UserService userService;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // 1. Lấy thông tin của user đang đăng nhập
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            User user = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 2. Cập nhật thông tin cơ bản (tên, sđt, avatar link)
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                             @RequestBody UserProfileUpdateDTO updateDTO) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            User updatedUser = userService.updateUserProfile(userDetails.getUsername(), updateDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 3. Đổi mật khẩu
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody PasswordChangeDTO passwordDTO) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            userService.changeUserPassword(
                userDetails.getUsername(),
                passwordDTO.getOldPassword(),
                passwordDTO.getNewPassword()
            );
            return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 4. Yêu cầu nâng cấp vai trò
    @PostMapping("/request-partner-role")
    public ResponseEntity<String> requestPartnerRole(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        try {
            userService.requestPartnerRole(userDetails.getUsername());
            return new ResponseEntity<>("Partner role request submitted. An admin will review it.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}