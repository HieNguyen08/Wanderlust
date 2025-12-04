package com.wanderlust.api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.wanderlust.api.controller.dto.BulkFlightSeatRequest;
import com.wanderlust.api.entity.FlightSeat;
import com.wanderlust.api.entity.types.SeatStatus;
import com.wanderlust.api.repository.FlightSeatRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class FlightSeatService implements BaseServices<FlightSeat> {

    private final FlightSeatRepository flightSeatRepository;

    // Get all flight seats
    public List<FlightSeat> findAll() {
        return flightSeatRepository.findAll();
    }

    // Add a flight seat
    public FlightSeat create(FlightSeat flightSeat) {
        return flightSeatRepository.insert(flightSeat);
    }

    // Update an existing flight seat
    public FlightSeat update(FlightSeat flightSeat) {
        FlightSeat updatedFlightSeat = flightSeatRepository.findById(flightSeat.getId())
                .orElseThrow(() -> new RuntimeException("FlightSeat not found with id " + flightSeat.getId()));

        if (flightSeat.getCabinClass() != null) updatedFlightSeat.setCabinClass(flightSeat.getCabinClass());
        if (flightSeat.getPrice() != null) updatedFlightSeat.setPrice(flightSeat.getPrice());
        if (flightSeat.getStatus() != null) updatedFlightSeat.setStatus(flightSeat.getStatus());

        return flightSeatRepository.save(updatedFlightSeat);
    }

    // Delete a flight seat by ID
    public void delete(String id) {
        if (flightSeatRepository.findById(id).isPresent()) {
            flightSeatRepository.deleteById(id);
        } else {
            throw new RuntimeException("FlightSeat not found with id " + id);
        }
    }

    // Delete all flight seats
    public void deleteAll() {
        flightSeatRepository.deleteAll();
    }

    // Get a specific flight seat by id
    public FlightSeat findByID(String id) {
        return flightSeatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlightSeat not found with id " + id));
    }

    /**
     * Tạo hàng loạt ghế cho một chuyến bay
     * 
     * @param request Yêu cầu chứa cấu hình ghế
     * @return Danh sách ghế được tạo
     */
    public List<FlightSeat> createBulkSeats(BulkFlightSeatRequest request) {
        List<FlightSeat> seats = new ArrayList<>();
        
        // Validate request
        if (request.getFlightId() == null || request.getFlightId().trim().isEmpty()) {
            throw new IllegalArgumentException("Flight ID is required");
        }
        if (request.getRows() == null || request.getRows() <= 0) {
            throw new IllegalArgumentException("Number of rows must be positive");
        }
        if (request.getColumns() == null || request.getColumns().isEmpty()) {
            throw new IllegalArgumentException("Columns list is required");
        }
        if (request.getSeatConfigurations() == null || request.getSeatConfigurations().isEmpty()) {
            throw new IllegalArgumentException("Seat configurations are required");
        }

        // Tạo ghế cho mỗi hàng
        for (int row = 1; row <= request.getRows(); row++) {
            for (BulkFlightSeatRequest.SeatConfiguration config : request.getSeatConfigurations()) {
                // Tạo ghế cho mỗi cột trong configuration
                for (String column : config.getColumns()) {
                    FlightSeat seat = new FlightSeat();
                    seat.setId(UUID.randomUUID().toString());
                    seat.setFlightId(request.getFlightId());
                    seat.setRow(row);
                    seat.setPosition(column);
                    seat.setSeatNumber(row + column);  // VD: "1A", "2B"
                    seat.setCabinClass(config.getCabinClass());
                    seat.setSeatType(config.getSeatType());
                    seat.setPrice(config.getPrice());
                    seat.setIsExitRow(config.getIsExitRow() != null ? config.getIsExitRow() : false);
                    seat.setExtraLegroom(config.getExtraLegroom() != null ? config.getExtraLegroom() : false);
                    seat.setFeatures(config.getFeatures());
                    seat.setStatus(SeatStatus.AVAILABLE);  // Mới tạo thì có sẵn
                    
                    seats.add(seat);
                }
            }
        }
        
        // Lưu tất cả ghế
        return flightSeatRepository.saveAll(seats);
    }

    /**
     * Xóa tất cả ghế của một chuyến bay
     * 
     * @param flightId ID của chuyến bay
     */
    public void deleteSeatsForFlight(String flightId) {
        flightSeatRepository.deleteByFlightId(flightId);
    }

    /**
     * Lấy tất cả ghế của một chuyến bay
     * 
     * @param flightId ID của chuyến bay
     * @return Danh sách ghế của chuyến bay
     */
    public List<FlightSeat> getSeatsForFlight(String flightId) {
        return flightSeatRepository.findByFlightId(flightId);
    }
}