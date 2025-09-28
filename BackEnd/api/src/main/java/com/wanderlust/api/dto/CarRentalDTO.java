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
public class CarRentalDTO {
    @Id
    private String rental_ID;
    private String car_type;
    private String car_Model;
    private Float rental_Cost;
    private String status;
}
