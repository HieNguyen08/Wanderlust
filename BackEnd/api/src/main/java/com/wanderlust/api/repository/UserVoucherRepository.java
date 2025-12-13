package com.wanderlust.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.wanderlust.api.entity.UserVoucher;

@Repository
public interface UserVoucherRepository extends MongoRepository<UserVoucher, String> {
    
    // Tìm tất cả voucher của user
    List<UserVoucher> findByUserId(String userId);
    
    // Tìm voucher theo user và code
    Optional<UserVoucher> findByUserIdAndVoucherCode(String userId, String voucherCode);
    
    // Tìm voucher khả dụng của user
    List<UserVoucher> findByUserIdAndStatus(String userId, String status);
    
    // Tìm voucher đã sử dụng của user
    @Query("{ 'userId': ?0, 'status': 'USED' }")
    List<UserVoucher> findUsedVouchersByUserId(String userId);
    
    // Tìm voucher available của user
    @Query("{ 'userId': ?0, 'status': 'AVAILABLE' }")
    List<UserVoucher> findAvailableVouchersByUserId(String userId);
    
    // Check xem user đã lưu voucher này chưa
    boolean existsByUserIdAndVoucherCode(String userId, String voucherCode);
    
    // Đếm số voucher đã dùng
    @Query(value = "{ 'userId': ?0, 'status': 'USED' }", count = true)
    long countUsedVouchers(String userId);

    // Đếm số lượt đã claim theo promotion
    long countByPromotionId(String promotionId);
    
    // Tính tổng tiết kiệm
    @Query("{ 'userId': ?0, 'status': 'USED' }")
    List<UserVoucher> findUsedVouchersForStatistics(String userId);
}
