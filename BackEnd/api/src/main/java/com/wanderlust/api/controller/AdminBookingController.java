package com.wanderlust.api.controller;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.dto.BookingStatisticsDTO; // <--- THÊM MỚI
import com.wanderlust.api.services.BookingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingService bookingService;

    // GET /api/admin/bookings - Quản lý (xem tất cả) bookings
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> allBookings = bookingService.findAll();
        return new ResponseEntity<>(allBookings, HttpStatus.OK);
    }

    // GET /api/admin/bookings/statistics - Thống kê bookings
    @GetMapping("/statistics")
    public ResponseEntity<BookingStatisticsDTO> getBookingStatistics() { // <--- THAY ĐỔI (1)
        // Gọi service method mới
        BookingStatisticsDTO stats = bookingService.getStatistics(); // <--- THAY ĐỔI (2)
        return new ResponseEntity<>(stats, HttpStatus.OK); // <--- THAY ĐỔI (3)
    }

    // PUT /api/admin/bookings/{id} - Admin cập nhật booking
    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable String id, @RequestBody BookingDTO bookingDTO) {
        BookingDTO updatedBooking = bookingService.update(id, bookingDTO);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    // DELETE /api/admin/bookings/{id} - Admin xóa booking
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable String id) {
        bookingService.delete(id);
        return new ResponseEntity<>("Booking has been deleted successfully!", HttpStatus.OK);
    }
}