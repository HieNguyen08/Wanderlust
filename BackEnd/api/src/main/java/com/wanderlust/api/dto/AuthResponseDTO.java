package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.Gender;
import com.wanderlust.api.entity.types.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String id;
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private String avatar;
    private Role role;
    private Gender gender;
}