package com.wanderlust.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class UserDTO {
    @Id
    private String id;

    private String fistName;
    private String lastName;
    private String avatar;
    private String email;
    private String mobile;
    private String password;
    private String role;
    private String address;
    private Boolean isBlocked;
    private String refreshToken;
    private LocalDateTime passwordChangeAt;
    private String passwordReserToken;
    private String registerToken;
}
