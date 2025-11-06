package com.wanderlust.api.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private String currentPassword; // Mật khẩu hiện tại
    private String newPassword;
    private String confirmPassword;
}