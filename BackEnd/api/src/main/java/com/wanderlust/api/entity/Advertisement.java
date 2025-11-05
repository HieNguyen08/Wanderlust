package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "advertisement")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Advertisement {
    @Id
    private String ad_ID;
    
    private String news;
    private String ad_Type;

    private String userId;
}
