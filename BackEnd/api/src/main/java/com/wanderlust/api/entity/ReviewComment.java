package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "reviewComment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewComment {
    @Id
    private String num_of_rating_ID;
    private String comment;
    private Float ratings;
    
    private String userId;
    private String hotel_ID;
    private String flight_ID;
    private String car_Rental_ID;
}
