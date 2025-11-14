package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatisticsDTO {

    // --- Tổng quan ---
    /**
     * Tổng số booking đã được tạo
     */
    private long totalBookings;
    
    /**
     * Tổng doanh thu (chỉ tính từ các booking đã 'COMPLETED')
     */
    private BigDecimal totalRevenue;

    // --- Thống kê theo Trạng thái ---
    /**
     * Đếm số lượng booking theo từng trạng thái
     * (VD: PENDING: 10, CONFIRMED: 5, CANCELLED: 2)
     */
    private Map<BookingStatus, Long> countByStatus;
    
    /**
     * Tính tổng doanh thu theo từng trạng thái
     * (Hữu ích để xem doanh thu từ PENDING, COMPLETED...)
     */
    private Map<BookingStatus, BigDecimal> revenueByStatus;

    // --- Thống kê theo Loại ---
    /**
     * Đếm số lượng booking theo từng loại dịch vụ
     * (VD: HOTEL: 8, FLIGHT: 5, CAR: 4)
     */
    private Map<BookingType, Long> countByType;
}