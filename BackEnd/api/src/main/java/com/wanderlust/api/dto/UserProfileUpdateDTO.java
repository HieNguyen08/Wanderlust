package com.wanderlust.api.dto;

import lombok.Data;

@Data
public class UserProfileUpdateDTO {
    // Chỉ cho phép user cập nhật những trường này
    private String firstName;
    private String lastName;
    private String avatar; // Dùng cho việc cập nhật bằng link
    private String mobile;
    private String address;
}