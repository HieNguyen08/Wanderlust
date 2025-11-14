package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Payment;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String>{
    
    List<Payment> findByUserId(String userId, Sort sort);
    
    Optional<Payment> findByBookingId(String bookingId);
    
    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByGatewayTransactionId(String gatewayTransactionId);
    
}