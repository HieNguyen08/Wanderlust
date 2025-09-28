package com.wanderlust.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class FlightDTO {
    @Id
    private String id;

    private String flight_Number;
    private LocalDateTime departure_Time;
    private LocalDateTime arrival_Time;
    private Duration duration;
    private Integer airline_ID;
}
