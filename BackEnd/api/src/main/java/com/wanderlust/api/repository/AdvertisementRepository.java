package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Advertisement;
import com.wanderlust.api.entity.types.AdPosition; // Thêm import
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Thêm import
import java.util.Optional;

@Repository
public interface AdvertisementRepository extends MongoRepository<Advertisement, String> {
    
    /**
     * Tìm kiếm quảng cáo dựa trên vị trí hiển thị
     * Cần thiết cho API: GET /api/advertisements?position=...
     */
    List<Advertisement> findByPosition(AdPosition position);
}