package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "activity")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    @Id
    private String id;
    private String name;
    private String description;
    private float price;
    private LocalDate startDate;
    private Integer max_Participants;
}
