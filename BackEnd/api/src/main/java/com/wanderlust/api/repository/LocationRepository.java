package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Location;
import com.wanderlust.api.entity.types.LocationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {

    // Lấy danh sách featured
    List<Location> findByFeaturedTrue();

    // Tìm kiếm theo tên hoặc slug (Case insensitive)
    @Query("{ '$or': [ { 'name': { '$regex': ?0, '$options': 'i' } }, { 'slug': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Location> searchByQuery(String query);

    // Hỗ trợ pagination cho findAll
    Page<Location> findAll(Pageable pageable);

    // Tìm theo Type (CONTRY, CITY, ...)
    List<Location> findByType(LocationType type);

    // Tìm theo Parent ID (Ví dụ tìm các thành phố thuộc 1 quốc gia)
    List<Location> findByParentLocationId(String parentLocationId);
}