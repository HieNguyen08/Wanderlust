package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "location")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    @Id
    private String location_ID;
    
    private String city;
    private String country;
    private String airport_Code;
    private String postCode;
}
