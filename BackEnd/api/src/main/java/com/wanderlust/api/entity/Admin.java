package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "admin")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Admin {
    @Id
    private String admin_ID;
    private String password;
    private String email;
    private String admin_Type;
}
