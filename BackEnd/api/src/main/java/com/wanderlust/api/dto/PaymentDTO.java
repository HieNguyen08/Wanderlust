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
public class PaymentDTO {
    @Id
    private String paymentId;

    private Float payment_Amount;
    private String payment_Method;
    private LocalDateTime payment_Date;
    private String Status;
}
