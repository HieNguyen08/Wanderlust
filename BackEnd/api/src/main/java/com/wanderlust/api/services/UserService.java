package com.wanderlust.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.repository.UserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserService implements BaseServices<User>, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Get all users
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // Add a user
    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
        return userRepository.insert(user);
    }

    // Update an existing user
    public User update(User user) {
        User updatedUser  = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User  not found with id " + user.getUserId()));

        if (user.getFirstName() != null) updatedUser .setFirstName(user.getFirstName());
        if (user.getLastName() != null) updatedUser .setLastName(user.getLastName());
        if (user.getAvatar() != null) updatedUser .setAvatar(user.getAvatar());
        if (user.getEmail() != null) updatedUser .setEmail(user.getEmail());
        if (user.getMobile() != null) updatedUser .setMobile(user.getMobile());
        if (user.getPassword() != null) updatedUser .setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
        if (user.getRole() != null) updatedUser .setRole(user.getRole());
        if (user.getAddress() != null) updatedUser .setAddress(user.getAddress());
        if (user.getIsBlocked() != null) updatedUser .setIsBlocked(user.getIsBlocked());
        if (user.getRefreshToken() != null) updatedUser .setRefreshToken(user.getRefreshToken());
        if (user.getPasswordChangeAt() != null) updatedUser .setPasswordChangeAt(user.getPasswordChangeAt());
        if (user.getPasswordResetToken() != null) updatedUser .setPasswordResetToken(user.getPasswordResetToken());
        if (user.getRegisterToken() != null) updatedUser .setRegisterToken(user.getRegisterToken());

        return userRepository.save(updatedUser );
    }

    // Delete a user by ID
    public void delete(String id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User  not found with id " + id);
        }
    }

    // Delete all users
    public void deleteAll() {
        userRepository.deleteAll();
    }

    // Get a specific user by id
    public User findByID(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User  not found with id " + id));
    }

    // Load user by email for authentication
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User  not found with email: " + email));

        // Convert User to UserDetails
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().toString()) // Assuming role is a single string, like "ADMIN"
                .build();
    }
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOptional = findByEmail(email);
        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {
            return userOptional;
        }
        return Optional.empty();
    }
    // public boolean sendPasswordResetEmail(String email) {
    //     Optional<User> userOptional = userRepository.findByEmail(email);
    //     if (userOptional.isPresent()) {
    //         User user = userOptional.get();
    //         String token = generatePasswordResetToken(user); // Tạo token cho việc đặt lại mật khẩu
    //         String resetLink = "http://localhost:5173/reset-password?token=" + token;

    //         SimpleMailMessage message = new SimpleMailMessage();
    //         message.setTo(user.getEmail());
    //         message.setSubject("Password Reset Request");
    //         message.setText("To reset your password, click the link below:\n" + resetLink);

    //         mailSender.send(message);
    //         return true;
    //     }
    //     return false;
    // }

    // private String generatePasswordResetToken(User user) {
    //     // Tạo token cho việc đặt lại mật khẩu (có thể sử dụng JWT hoặc một phương pháp khác)
    //     // Lưu token vào cơ sở dữ liệu hoặc bộ nhớ tạm thời
    //     return "generated-token"; // Thay thế bằng logic thực tế
    // }
}