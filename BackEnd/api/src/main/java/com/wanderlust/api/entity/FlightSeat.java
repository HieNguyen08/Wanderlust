package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "flightSeat")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlightSeat {
    @Id
    private String seat_ID;

    private String seat_Class;
    private Float price;
    private Boolean availability;

    //ID của chuyến bay
    private String flight_ID;
}
