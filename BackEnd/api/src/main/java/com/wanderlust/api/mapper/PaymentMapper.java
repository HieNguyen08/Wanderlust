package com.wanderlust.api.mapper;

import com.wanderlust.api.entity.Payment;
import com.wanderlust.api.dto.PaymentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    Payment toEntity(PaymentDTO paymentDTO);
    PaymentDTO toDTO(Payment payment);
}
