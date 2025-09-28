package com.wanderlust.api.controller;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Optional<User> userOptional = userService.authenticate(email, password);
        if (userOptional.isPresent()) {
            Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return "Login successful"; // You can return a JWT token here if needed
        }
        return "Invalid email or password";
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser (user);
    }

    // @PostMapping("/forgot-password")
    // public ResponseEntity<?> forgotPassword(@RequestBody String email) {
    //     // Gọi service để xử lý quên mật khẩu
    //     boolean isSent = userService.sendPasswordResetEmail(email);
    //     if (isSent) {
    //         return ResponseEntity.ok("Password reset email sent successfully.");
    //     } else {
    //         return ResponseEntity.badRequest().body("Failed to send password reset email.");
    //     }
    // }
}