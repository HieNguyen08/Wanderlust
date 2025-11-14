package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends MongoRepository<Hotel, String> {
    List<Hotel> findByFeaturedTrue();
    
    // Tìm kiếm cơ bản theo tên hoặc địa chỉ (Case insensitive)
    @Query("{ '$or': [ { 'name': { $regex: ?0, $options: 'i' } }, { 'address': { $regex: ?0, $options: 'i' } } ] }")
    List<Hotel> searchBasic(String keyword);
    
    List<Hotel> findByVendorId(String vendorId);
}