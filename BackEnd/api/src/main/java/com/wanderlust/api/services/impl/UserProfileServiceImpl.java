package com.wanderlust.api.services.impl;

import com.wanderlust.api.dto.NotificationSettingsDTO;
import com.wanderlust.api.entity.NotificationSettings;
import com.wanderlust.api.entity.User;
import com.wanderlust.api.entity.types.MembershipLevel;
import com.wanderlust.api.entity.types.Role;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.mapper.NotificationSettingsMapper;
import com.wanderlust.api.mapper.UserProfileMapper;
import com.wanderlust.api.repository.UserRepository;
import com.wanderlust.api.services.UserProfileService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import com.wanderlust.api.dto.UserProfileResponseDTO;
import com.wanderlust.api.dto.UserProfileUpdateDTO;
import com.wanderlust.api.dto.UserStatsDTO;
import com.wanderlust.api.dto.MembershipInfoDTO;
import com.wanderlust.api.dto.ChangePasswordDTO;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfileMapper userProfileMapper; // [MỚI] Inject mapper
    private final NotificationSettingsMapper notificationSettingsMapper; // [MỚI] Inject mapper

    /**
     * Lấy thông tin user hiện tại (cho Header, ProfilePage) [cite: 4]
     */
    @Override
    public UserProfileResponseDTO getCurrentUserProfile(String userId) {
        User user = findUserById(userId);
        return userProfileMapper.toUserProfileResponseDTO(user); // Dùng mapper
    }

    /**
     * Cập nhật thông tin cá nhân (cho ProfilePage - Edit mode) [cite: 4]
     */
    @Override
    @Transactional
    public UserProfileResponseDTO updateUserProfile(String userId, UserProfileUpdateDTO dto) {
        User user = findUserById(userId);
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getMobile() != null) user.setMobile(dto.getMobile());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar());
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getCity() != null) user.setCity(dto.getCity());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());
        if (dto.getPassportNumber() != null) user.setPassportNumber(dto.getPassportNumber());
        if (dto.getPassportExpiry() != null) user.setPassportExpiryDate(dto.getPassportExpiry());
        if (dto.getGender() != null) user.setGender(dto.getGender());

        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return userProfileMapper.toUserProfileResponseDTO(savedUser); // Dùng mapper
    }

    @Override
    public UserStatsDTO getUserStats(String userId) {
        User user = findUserById(userId);
        
        UserStatsDTO statsDTO = new UserStatsDTO();
        statsDTO.setTotalTrips(user.getTotalTrips() != null ? user.getTotalTrips() : 0);
        statsDTO.setLoyaltyPoints(user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0);
        statsDTO.setTotalReviews(user.getTotalReviews() != null ? user.getTotalReviews() : 0);
        
        return statsDTO;
    }


    @Override
    public MembershipInfoDTO getMembershipInfo(String userId) {
        User user = findUserById(userId);
                
        MembershipInfoDTO membershipDTO = new MembershipInfoDTO();
        membershipDTO.setCurrentLevel(user.getMembershipLevel() != null ? user.getMembershipLevel() : MembershipLevel.BRONZE);
        membershipDTO.setCurrentPoints(user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0);
        
        int pointsForNextLevel = 0;
        MembershipLevel nextLevel = null;
        
        switch (membershipDTO.getCurrentLevel()) {
            case BRONZE:
                pointsForNextLevel = 5000;
                nextLevel = MembershipLevel.SILVER;
                break;
            case SILVER:
                pointsForNextLevel = 15000;
                nextLevel = MembershipLevel.GOLD;
                break;
            case GOLD:
                pointsForNextLevel = 30000;
                nextLevel = MembershipLevel.PLATINUM;
                break;
            case PLATINUM:
                pointsForNextLevel = 30000;
                nextLevel = MembershipLevel.PLATINUM;
                break;
        }
        
        membershipDTO.setNextLevel(nextLevel);
        membershipDTO.setPointsForNextLevel(pointsForNextLevel);
        
        double progress = (pointsForNextLevel > 0 && membershipDTO.getCurrentPoints() < pointsForNextLevel) 
                          ? ((double) membershipDTO.getCurrentPoints() / pointsForNextLevel) * 100 
                          : 100.0;
        
        if (membershipDTO.getCurrentLevel() == MembershipLevel.PLATINUM) {
            membershipDTO.setProgressPercentage(100.0);
        } else {
            membershipDTO.setProgressPercentage(Math.min(progress, 100.0));
        }
        
        return membershipDTO;
    }

    /**
     * Đổi mật khẩu (cho SettingsPage) [cite: 7]
     */
    @Override
    @Transactional
    public void changePassword(String userId, ChangePasswordDTO changePasswordDTO) {
        User user = findUserById(userId);

        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match.");
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            if (changePasswordDTO.getCurrentPassword() != null && !changePasswordDTO.getCurrentPassword().isEmpty()) {
                throw new IllegalArgumentException("OAuth user cannot change password this way.");
            }
        } 
        else {
            if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Incorrect old password.");
            }
        }
        
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        user.setPasswordChangeAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
    }
    

    // @Override
    // @Transactional
    // public String uploadAvatar(String userId, MultipartFile file) {
    //     User user = findUserById(userId);

    //     // 1. Gọi FileStorageService để lưu file vào thư mục "avatars"
    //     String avatarUrl = fileStorageService.storeFile(file, "avatars");

    //     // 2. Cập nhật URL vào user
    //     user.setAvatar(avatarUrl);
    //     user.setUpdatedAt(LocalDateTime.now());
    //     userRepository.save(user);

    //     return avatarUrl;
    // }

    /**
     * Lấy cài đặt thông báo (cho SettingsPage) 
     */
    @Override
    public NotificationSettingsDTO getNotificationSettings(String userId) {
        User user = findUserById(userId);
        
        NotificationSettings settings = user.getNotificationSettings();
        if (settings == null) {
            settings = new NotificationSettings();
            user.setNotificationSettings(settings);
            userRepository.save(user);
        }
        
        return notificationSettingsMapper.toDTO(settings);
    }


    @Override
    @Transactional
    public void updateNotificationSettings(String userId, NotificationSettingsDTO settingsDTO) {
        User user = findUserById(userId);

        NotificationSettings userSettings = user.getNotificationSettings();
        if (userSettings == null) {
            userSettings = new NotificationSettings();
        }

        // 1. Dùng mapper để cập nhật entity từ DTO
        notificationSettingsMapper.updateEntityFromDto(settingsDTO, userSettings);
        
        user.setNotificationSettings(userSettings); // Gán lại (nếu cần)
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Auto-update loyalty points khi user booking [cite: 10]
     */
    @Override
    @Transactional
    public void addLoyaltyPoints(String userId, BigDecimal spentAmount) {
        User user = findUserById(userId);

        int pointsToAdd = spentAmount.divide(new BigDecimal("10000"), 0, RoundingMode.FLOOR).intValue();

        if (pointsToAdd > 0) {
            int currentPoints = (user.getLoyaltyPoints() != null) ? user.getLoyaltyPoints() : 0;
            user.setLoyaltyPoints(currentPoints + pointsToAdd);
            
            // 3. Gọi update membership level (phải save trong hàm đó)
            this.updateMembershipLevel(user); // Truyền đối tượng User
        }
    }

    /**
     * Auto-update membership level dựa trên points [cite: 11]
     */
    @Override
    @Transactional
    public void updateMembershipLevel(String userId) {
        User user = findUserById(userId);
        this.updateMembershipLevel(user); // Gọi hàm helper
    }

    @Transactional
    protected void updateMembershipLevel(User user) {
        int points = (user.getLoyaltyPoints() != null) ? user.getLoyaltyPoints() : 0;
        MembershipLevel currentLevel = (user.getMembershipLevel() != null) ? user.getMembershipLevel() : MembershipLevel.BRONZE;
        MembershipLevel newLevel = MembershipLevel.BRONZE;

        if (points >= 30000) {
            newLevel = MembershipLevel.PLATINUM;
        } else if (points >= 15000) {
            newLevel = MembershipLevel.GOLD;
        } else if (points >= 5000) {
            newLevel = MembershipLevel.SILVER;
        }

        if (currentLevel != newLevel) {
            user.setMembershipLevel(newLevel);
            // Gửi thông báo "Lên hạng" ở đây
        }
        
        // Luôn save user (vì addLoyaltyPoints gọi hàm này)
        userRepository.save(user);
    }

    @Override
    public void requestPartnerRole(String userId) {
        User user = findUserById(userId);

        if (user.getRole() != Role.USER) {
            if (user.getRole() == Role.PARTNER) {
                throw new RuntimeException("Bạn đã là Đối tác (Partner).");
            }
            if (user.getRole() == Role.ADMIN) {
                throw new RuntimeException("Quản trị viên (Admin) không thể thực hiện yêu cầu này.");
            }
            throw new RuntimeException("Chỉ người dùng (User) mới có thể yêu cầu nâng cấp lên Đối tác.");
        }
        
        if ("PENDING".equals(user.getPartnerRequestStatus())) {
            throw new RuntimeException("Yêu cầu của bạn đã được gửi và đang chờ duyệt.");
        }

        user.setPartnerRequestStatus("PENDING");
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // ==================================================================
    // HELPER METHODS
    // ==================================================================

    // Hàm helper chung để tìm User
    private User findUserById(String userId) {
        return userRepository.findByUserId(userId) // 
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
    
}