package com.wanderlust.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.wanderlust.api.entity.User;
import com.wanderlust.api.repository.UserRepository;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.dto.UserProfileUpdateDTO;
import com.wanderlust.api.dto.MembershipInfoDTO;
import com.wanderlust.api.dto.UserProfileResponseDTO;
import com.wanderlust.api.dto.UserStatsDTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserService implements BaseServices<User> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Get all users
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // Add a user (Dùng bởi Admin Controller)
    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
        
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        user.setCreatedAt(LocalDateTime.now());
        user.setIsBlocked(false);
        if (user.getMembershipLevel() == null) user.setMembershipLevel(com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        if (user.getLoyaltyPoints() == null) user.setLoyaltyPoints(0);
        if (user.getTotalTrips() == null) user.setTotalTrips(0);
        if (user.getTotalReviews() == null) user.setTotalReviews(0);


        return userRepository.insert(user);
    }

    // Update an existing user
    public User update(User user) {
        User updatedUser  = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User  not found with id " + user.getUserId()));

        if (user.getFirstName() != null) updatedUser .setFirstName(user.getFirstName());
        if (user.getLastName() != null) updatedUser .setLastName(user.getLastName());
        if (user.getAvatar() != null) updatedUser .setAvatar(user.getAvatar());
        if (user.getGender() != null) updatedUser .setGender(user.getGender()); 
        if (user.getEmail() != null) updatedUser .setEmail(user.getEmail());
        if (user.getMobile() != null) updatedUser .setMobile(user.getMobile());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            updatedUser.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
            updatedUser.setPasswordChangeAt(LocalDateTime.now()); // **Ghi lại thời gian**
        }
        if (user.getRole() != null) updatedUser .setRole(user.getRole()); 
        if (user.getAddress() != null) updatedUser .setAddress(user.getAddress());
        if (user.getIsBlocked() != null) updatedUser .setIsBlocked(user.getIsBlocked());
        
        if (user.getDateOfBirth() != null) updatedUser.setDateOfBirth(user.getDateOfBirth());
        if (user.getCity() != null) updatedUser.setCity(user.getCity());
        if (user.getCountry() != null) updatedUser.setCountry(user.getCountry());
        if (user.getPassportNumber() != null) updatedUser.setPassportNumber(user.getPassportNumber());
        if (user.getPassportExpiryDate() != null) updatedUser.setPassportExpiryDate(user.getPassportExpiryDate());
        if (user.getMembershipLevel() != null) updatedUser.setMembershipLevel(user.getMembershipLevel());
		if (user.getLoyaltyPoints() != null) updatedUser.setLoyaltyPoints(user.getLoyaltyPoints());
		if (user.getTotalTrips() != null) updatedUser.setTotalTrips(user.getTotalTrips());
		if (user.getTotalReviews() != null) updatedUser.setTotalReviews(user.getTotalReviews());
        if (user.getPartnerRequestStatus() != null) updatedUser.setPartnerRequestStatus(user.getPartnerRequestStatus());

        updatedUser.setUpdatedAt(LocalDateTime.now());
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


    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        user.setIsBlocked(false);
        user.setCreatedAt(LocalDateTime.now());
        if (user.getMembershipLevel() == null) user.setMembershipLevel(com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        if (user.getLoyaltyPoints() == null) user.setLoyaltyPoints(0);
        if (user.getTotalTrips() == null) user.setTotalTrips(0);
        if (user.getTotalReviews() == null) user.setTotalReviews(0);
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOptional = findByEmail(email);
        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {
            User user = userOptional.get();
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            return userOptional;
        }
        return Optional.empty();
    }

        // **PHƯƠNG THỨC MỚI: Tạo người dùng OAuth2 (Google/Facebook)**
    public User createOauthUser(String email, String name, String avatarUrl) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setAvatar(avatarUrl);
        
        String[] names = name.split(" ", 2);
        newUser.setFirstName(names[0]);
        if (names.length > 1) {
            newUser.setLastName(names[1]);
        } else {
            newUser.setLastName(""); // Hoặc để null tùy logic
        }

        newUser.setRole(Role.USER); // **Mặc định là USER**
        newUser.setIsBlocked(false); // **Mặc định là không khóa**
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setMembershipLevel(com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        newUser.setLoyaltyPoints(0);
        newUser.setTotalTrips(0);
        newUser.setTotalReviews(0);

        return userRepository.insert(newUser);
    }

    public void changeUserPassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Kiểm tra mật khẩu cũ
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new IllegalArgumentException("Incorrect old password");
            }
        } else if (oldPassword != null && !oldPassword.isEmpty()) {
            // User OAuth2 không có mật khẩu cũ
            throw new IllegalArgumentException("OAuth2 user cannot change password this way.");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordChangeAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
    }
    
    // PHƯƠNG THỨC MỚI: Cập nhật hồ sơ người dùng (an toàn)
    public UserProfileResponseDTO updateUserProfile(String email, UserProfileUpdateDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getMobile() != null) user.setMobile(dto.getMobile());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar());
        
        // **THÊM CÁC TRƯỜNG MỚI**
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getCity() != null) user.setCity(dto.getCity());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());
        if (dto.getPassportNumber() != null) user.setPassportNumber(dto.getPassportNumber());
        if (dto.getPassportExpiry() != null) user.setPassportExpiryDate(dto.getPassportExpiry());
        if (dto.getGender() != null) user.setGender(dto.getGender());

        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return mapToUserProfileResponseDTO(savedUser); // Trả về DTO
    }

    // PHƯƠNG THỨC MỚI: Yêu cầu làm PARTNER (Đã có)
    public void requestPartnerRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        if (user.getRole() == Role.PARTNER || user.getRole() == Role.ADMIN) {
            throw new RuntimeException("User is already a partner or admin.");
        }
        if ("PENDING".equals(user.getPartnerRequestStatus())) {
            throw new RuntimeException("A partner request is already pending.");
        }

        user.setPartnerRequestStatus("PENDING");
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public UserProfileResponseDTO getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return mapToUserProfileResponseDTO(user);
    }

    public UserStatsDTO getUserStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        UserStatsDTO statsDTO = new UserStatsDTO();
        statsDTO.setTotalTrips(user.getTotalTrips() != null ? user.getTotalTrips() : 0);
        statsDTO.setLoyaltyPoints(user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0);
        statsDTO.setTotalReviews(user.getTotalReviews() != null ? user.getTotalReviews() : 0);
        
        return statsDTO;
    }

    public MembershipInfoDTO getMembershipInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        MembershipInfoDTO membershipDTO = new MembershipInfoDTO();
        membershipDTO.setCurrentLevel(user.getMembershipLevel() != null ? user.getMembershipLevel() : com.wanderlust.api.entity.types.MembershipLevel.BRONZE);
        membershipDTO.setCurrentPoints(user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0);
        
        // Logic tính toán điểm lên hạng (ví dụ)
        int totalTrips = user.getTotalTrips() != null ? user.getTotalTrips() : 0;
        int totalReviews = user.getTotalReviews() != null ? user.getTotalReviews() : 0;
        
        int calculatedPoints = (totalTrips * 100) + (totalReviews * 20);
        membershipDTO.setCurrentPoints(calculatedPoints);

        int pointsForNextLevel = 0;
        com.wanderlust.api.entity.types.MembershipLevel nextLevel = null;
        
        switch (membershipDTO.getCurrentLevel()) {
            case BRONZE:
                pointsForNextLevel = 5000;
                nextLevel = com.wanderlust.api.entity.types.MembershipLevel.SILVER;
                break;
            case SILVER:
                pointsForNextLevel = 15000;
                nextLevel = com.wanderlust.api.entity.types.MembershipLevel.GOLD;
                break;
            case GOLD:
                pointsForNextLevel = 30000;
                nextLevel = com.wanderlust.api.entity.types.MembershipLevel.PLATINUM;
                break;
            case PLATINUM:
                pointsForNextLevel = 30000; // Đã ở hạng cao nhất
                nextLevel = com.wanderlust.api.entity.types.MembershipLevel.PLATINUM;
                break;
        }
        
        membershipDTO.setNextLevel(nextLevel);
        membershipDTO.setPointsForNextLevel(pointsForNextLevel);
        
        double progress = (pointsForNextLevel > 0) ? ((double) membershipDTO.getCurrentPoints() / pointsForNextLevel) * 100 : 100;
        membershipDTO.setProgressPercentage(Math.min(progress, 100.0)); // Giới hạn ở 100%
        
        return membershipDTO;
    }

    private UserProfileResponseDTO mapToUserProfileResponseDTO(User user) {
        UserProfileResponseDTO dto = new UserProfileResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setAvatar(user.getAvatar());
        dto.setMobile(user.getMobile());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setCity(user.getCity());
        dto.setCountry(user.getCountry());
        dto.setPassportNumber(user.getPassportNumber());
        dto.setPassportExpiryDate(user.getPassportExpiryDate());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setPartnerRequestStatus(user.getPartnerRequestStatus());
        return dto;
    }
    
}