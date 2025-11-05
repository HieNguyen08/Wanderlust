package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "flight")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flight {
    @Id
    private String id;

    private String flight_Number;
    private LocalDateTime departure_Time;
    private LocalDateTime arrival_Time;
    private Duration duration;
    private Integer airline_ID;

    private String userId;
}
