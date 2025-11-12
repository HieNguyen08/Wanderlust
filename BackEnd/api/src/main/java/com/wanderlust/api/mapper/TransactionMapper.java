package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.walletDTO.TransactionDetailDTO;
import com.wanderlust.api.dto.walletDTO.TransactionResponseDTO;
import com.wanderlust.api.entity.WalletTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);

    /**
     * Map từ Entity sang DTO cho danh sách (List Response)
     * (orderId được map tự động vì tên booking_Id trong entity)
     */
    TransactionResponseDTO toTransactionResponseDTO(WalletTransaction transaction);

    /**
     * Map từ Entity sang DTO cho chi tiết (Detail Response)
     */
    @Mapping(target = "serviceName", ignore = true) // Sẽ được điền bởi Service
    @Mapping(target = "vendorName", ignore = true)  // Sẽ được điền bởi Service
    TransactionDetailDTO toTransactionDetailDTO(WalletTransaction transaction);
}