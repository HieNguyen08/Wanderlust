package com.wanderlust.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private String avatar;
}