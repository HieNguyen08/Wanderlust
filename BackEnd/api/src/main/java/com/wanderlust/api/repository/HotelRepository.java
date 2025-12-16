package com.wanderlust.api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.wanderlust.api.entity.Hotel;

@Repository
public interface HotelRepository extends MongoRepository<Hotel, String> {
    List<Hotel> findByFeaturedTrue();

    // Tìm kiếm cơ bản theo tên hoặc địa chỉ (Case insensitive)
    @Query("{ '$or': [ { 'name': { $regex: ?0, $options: 'i' } }, { 'address': { $regex: ?0, $options: 'i' } } ] }")
    List<Hotel> searchBasic(String keyword);

    List<Hotel> findByVendorId(String vendorId);

    Page<Hotel> findByVendorId(String vendorId, Pageable pageable);

    // Tìm kiếm nâng cao theo locationId
    List<Hotel> findByLocationId(String locationId);

    // Tìm theo hạng sao
    List<Hotel> findByStarRatingBetween(Integer minStar, Integer maxStar);

    // Tìm theo loại khách sạn
    List<Hotel> findByHotelType(com.wanderlust.api.entity.types.HotelType hotelType);

    // Tìm theo featured và verified
    List<Hotel> findByFeaturedTrueAndVerifiedTrue();
}