package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "carRental")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarRental {
    @Id
    private String rental_ID;
    private String car_Type;
    private String car_Model;
    private Float rental_Cost;
    private String status;
}
