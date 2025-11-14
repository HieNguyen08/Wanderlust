package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.payment.PaymentDTO;
import com.wanderlust.api.entity.Payment;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PaymentMapper {

    /**
     * Convert Entity -> DTO
     */
    PaymentDTO toDTO(Payment payment);

    /**
     * Convert List Entity -> List DTO
     */
    List<PaymentDTO> toDTOs(List<Payment> payments);

    /**
     * Convert DTO -> Entity (Dùng cho Create)
     * Bỏ qua ID và các trường Audit khi tạo mới
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Payment toEntity(PaymentDTO dto);

    /**
     * Update Entity từ DTO (Dùng cho Update)
     * Chỉ update các trường có dữ liệu (nhờ nullValuePropertyMappingStrategy = IGNORE)
     */
    @Mapping(target = "id", ignore = true) // Không cho phép update ID
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(PaymentDTO dto, @MappingTarget Payment payment);
}