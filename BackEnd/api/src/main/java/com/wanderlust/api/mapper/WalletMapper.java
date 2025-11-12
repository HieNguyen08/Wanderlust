package com.wanderlust.api.mapper;

import com.wanderlust.api.dto.walletDTO.WalletResponseDTO;
import com.wanderlust.api.entity.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface WalletMapper {

    WalletMapper INSTANCE = Mappers.getMapper(WalletMapper.class);

    // MapStruct sẽ tự động map các trường có tên giống nhau
    // (walletId, balance, currency, totalTopUp, totalSpent, totalRefund, status)
    // từ Wallet Entity sang WalletResponseDTO
    WalletResponseDTO toWalletResponseDTO(Wallet wallet);
}