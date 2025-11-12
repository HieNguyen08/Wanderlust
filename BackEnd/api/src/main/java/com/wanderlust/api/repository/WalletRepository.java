package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Wallet;
import com.wanderlust.api.entity.types.WalletStatus;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Repository
public interface WalletRepository extends MongoRepository<Wallet, String> {
    Optional<Wallet> findByUserId(String userId);
    List<Wallet> findByStatus(WalletStatus status);
    
    @Query("{ 'balance': { $gt: ?0 } }")
    List<Wallet> findWalletsWithBalanceGreaterThan(BigDecimal amount);
}