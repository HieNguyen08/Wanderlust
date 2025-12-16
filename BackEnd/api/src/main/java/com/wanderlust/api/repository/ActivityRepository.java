package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.types.ActivityCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    // Tìm các activity nổi bật
    List<Activity> findByFeaturedTrue();

    // Tìm theo vendor (cho trang quản lý của partner)
    List<Activity> findByVendorId(String vendorId);

    Page<Activity> findByVendorId(String vendorId, Pageable pageable);

    // Ví dụ tìm kiếm đơn giản (Search phức tạp sẽ dùng MongoTemplate trong Service)
    List<Activity> findByLocationId(String locationId);

    List<Activity> findByCategory(ActivityCategory category);

    // Tìm kiếm theo tên (cho Global Search)
    List<Activity> findByNameContainingIgnoreCase(String name);
}