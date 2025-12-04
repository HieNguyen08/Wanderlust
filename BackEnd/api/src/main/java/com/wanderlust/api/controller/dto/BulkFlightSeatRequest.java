package com.wanderlust.api.controller.dto;

import java.math.BigDecimal;
import java.util.List;

import com.wanderlust.api.entity.types.CabinClass;
import com.wanderlust.api.entity.types.SeatType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO để tạo hàng loạt ghế cho một chuyến bay
 * 
 * Ví dụ:
 * {
 *   "flightId": "flight-123",
 *   "rows": 18,
 *   "columns": ["A", "B", "C", "D", "E", "F"],
 *   "seatConfigurations": [
 *     { "columns": ["A", "B"], "cabinClass": "ECONOMY", "seatType": "WINDOW", "price": 0 },
 *     { "columns": ["C", "D"], "cabinClass": "ECONOMY", "seatType": "MIDDLE", "price": 0 },
 *     { "columns": ["E", "F"], "cabinClass": "ECONOMY", "seatType": "AISLE", "price": 0 }
 *   ]
 * }
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkFlightSeatRequest {
    
    private String flightId;  // ID của chuyến bay
    
    private Integer rows;  // Số hàng ghế (1-18, 1-30 tùy loại máy bay)
    
    private List<String> columns;  // Danh sách cột: ["A", "B", "C", "D", "E", "F"]
    
    private List<SeatConfiguration> seatConfigurations;  // Cấu hình ghế cho từng khu vực
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SeatConfiguration {
        private List<String> columns;  // Danh sách cột cho khu vực này: ["A", "B"]
        private CabinClass cabinClass;  // Hạng: ECONOMY, BUSINESS, FIRST
        private SeatType seatType;  // Loại: WINDOW, MIDDLE, AISLE
        private BigDecimal price;  // Giá thêm (nếu có)
        private List<String> features;  // Tính năng: ["wifi", "power", "usb"]
        private Boolean isExitRow;  // Hàng thoát hiểm?
        private Boolean extraLegroom;  // Có chân thêm không?
    }
}
