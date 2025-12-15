package com.wanderlust.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus; // <--- THÊM MỚI
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.dto.BookingStatisticsDTO;
import com.wanderlust.api.services.BookingService;

import lombok.AllArgsConstructor;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingService bookingService;

    // GET /api/admin/bookings - Quản lý (xem tất cả) bookings
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> allBookings = bookingService.findAll();
        return new ResponseEntity<>(allBookings, HttpStatus.OK);
    }

    // GET /api/admin/bookings/refund-requests - Các booking yêu cầu hoàn tiền (đã thanh toán)
    @GetMapping("/refund-requests")
    public ResponseEntity<List<BookingDTO>> getRefundRequestedBookings() {
        List<BookingDTO> refundRequests = bookingService.findRefundRequestedWithCompletedPayment();
        return new ResponseEntity<>(refundRequests, HttpStatus.OK);
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