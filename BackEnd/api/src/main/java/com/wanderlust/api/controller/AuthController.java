package com.wanderlust.api.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.AuthResponseDTO;
import com.wanderlust.api.dto.LoginRequestDTO;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.JwtService;
import com.wanderlust.api.services.UserService;
import com.wanderlust.api.services.WalletService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final WalletService walletService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<User> userOptional = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtService.generateToken(user);

            AuthResponseDTO response = new AuthResponseDTO(
                    user.getUserId(),
                    token,
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getAvatar(),
                    user.getRole(),
                    user.getGender());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Kiểm tra email đã tồn tại
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(400).body("Email already exists");
        }

        // Đăng ký user mới
        User newUser = userService.registerUser(user);

        // Tạo ví cho user mới
        walletService.createWalletForNewUser(newUser.getUserId());

        // Tạo JWT token
        String token = jwtService.generateToken(newUser);

        // Trả về response giống login
        AuthResponseDTO response = new AuthResponseDTO(
                newUser.getUserId(),
                token,
                newUser.getFirstName(),
                newUser.getLastName(),
                newUser.getEmail(),
                newUser.getAvatar(),
                newUser.getRole(),
                newUser.getGender());

        return ResponseEntity.ok(response);
    }
}