package com.wanderlust.api.entity;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "room")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    @Id
    private String room_ID;

    private String room_Type;
    private Float price;
    private String status;
    
}
