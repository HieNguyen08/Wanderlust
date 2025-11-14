package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.types.BookingStatus; // Thêm import
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query; // Thêm import
import org.springframework.stereotype.Repository;

import java.time.LocalDate; // Thêm import
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId, Sort sort);

    List<Booking> findByVendorId(String vendorId, Sort sort);

    /**
     * MỚI: Tìm các booking của một xe cụ thể (carRentalId)
     * mà có trạng thái "active" (PENDING, CONFIRMED)
     * VÀ bị trùng lặp ngày (overlap) với ngày yêu cầu.
     *
     * Logic overlap: (StartA < EndB) and (EndA > StartB)
     *
     * @param carRentalId   ID của xe cần kiểm tra
     * @param requestedStart Ngày bắt đầu yêu cầu
     * @param requestedEnd   Ngày kết thúc yêu cầu
     * @param activeStatuses Danh sách trạng thái (VD: PENDING, CONFIRMED)
     * @return Danh sách các booking bị trùng
     */
    @Query("{ 'carRentalId': ?0, 'status': { '$in': ?3 }, '$and': [ { 'startDate': { '$lt': ?2 } }, { 'endDate': { '$gt': ?1 } } ] }")
    List<Booking> findConflictingCarBookings(
            String carRentalId,
            LocalDate requestedStart,
            LocalDate requestedEnd,
            List<BookingStatus> activeStatuses
    );
}