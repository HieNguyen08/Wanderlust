package com.wanderlust.api.services;

import com.wanderlust.api.dto.NotificationSettingsDTO;

import java.math.BigDecimal;


import com.wanderlust.api.dto.UserProfileResponseDTO;
import com.wanderlust.api.dto.UserProfileUpdateDTO;
import com.wanderlust.api.dto.UserStatsDTO;
import com.wanderlust.api.dto.MembershipInfoDTO;
import com.wanderlust.api.dto.ChangePasswordDTO;

public interface UserProfileService {

    // Lấy thông tin user từ JWT token
    UserProfileResponseDTO getCurrentUserProfile(String userId);

    //Cập nhật thông tin cá nhân
    UserProfileResponseDTO updateUserProfile(String userId, UserProfileUpdateDTO updateDTO);

    // Lấy thống kê: totalTrips, loyaltyPoints, totalReviews
    UserStatsDTO getUserStats(String userId);

    // Tính membership level và progress
    MembershipInfoDTO getMembershipInfo(String userId);

    // Đổi mật khẩu (validate current password)
    void changePassword(String userId, ChangePasswordDTO changePasswordDTO);

    // Upload và lưu avatar URL
    // String uploadAvatar(String userId, MultipartFile file);

    // Lấy cài đặt thông báo
    NotificationSettingsDTO getNotificationSettings(String userId);

    // Cập nhật settings thông báo
    void updateNotificationSettings(String userId, NotificationSettingsDTO settingsDTO);

    // Auto-update loyalty points khi user booking
    void addLoyaltyPoints(String userId, BigDecimal spentAmount);

    // Auto-update membership level dựa trên points
    void updateMembershipLevel(String userId);

    void requestPartnerRole(String userId);
}