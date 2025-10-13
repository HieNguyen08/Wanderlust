package com.wanderlust.api.controller;

import com.wanderlust.api.dto.AuthResponseDTO; // Tạo DTO này
import com.wanderlust.api.dto.LoginRequestDTO; // Tạo DTO này
import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.JwtService;
import com.wanderlust.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // Sử dụng constructor injection
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    // --- Sửa đổi hoàn toàn phương thức login ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<User> userOptional = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtService.generateToken(user);
            
            AuthResponseDTO response = new AuthResponseDTO(token, user.getFirstName(), user.getLastName(), user.getEmail(), user.getAvatar());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
    // ------------------------------------------

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }
}