package com.wanderlust.api.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.wanderlust.api.entity.Refund;
import com.wanderlust.api.entity.types.RefundStatus;

@Repository
public interface RefundRepository extends MongoRepository<Refund, String> {
    List<Refund> findByUserId(String userId);

    List<Refund> findByStatus(RefundStatus status);

    List<Refund> findByBookingId(String bookingId);
}
