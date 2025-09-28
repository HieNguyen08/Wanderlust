package com.wanderlust.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

import org.springframework.data.annotation.Id;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class AdminDTO {
    @Id
    private String admin_ID;
    private String password;
    private String email;
    private String admin_Type;
}
