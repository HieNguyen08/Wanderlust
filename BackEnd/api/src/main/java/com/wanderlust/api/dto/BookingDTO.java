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
public class BookingDTO {
    @Id
    private String booking_Id;

    private String booking_Type;
    private LocalDateTime booking_Date;
    private String status;
    private Float total_price;
}
