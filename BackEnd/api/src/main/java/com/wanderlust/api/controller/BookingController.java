package com.wanderlust.api.controller;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.services.BookingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/bookings")
@PreAuthorize("isAuthenticated()") // Yêu cầu đăng nhập cho tất cả endpoints
public class BookingController {

    private final BookingService bookingService;

    // GET /api/bookings - Lấy danh sách bookings của user hiện tại [CITE: 29]
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication authentication) {
        String userId = authentication.getName(); // Lấy ID (hoặc email) của user đang đăng nhập
        // TODO: Đảm bảo 'authentication.getName()' trả về đúng User ID
        return new ResponseEntity<>(bookingService.findByUserId(userId), HttpStatus.OK);
    }

    // GET /api/bookings/{id} - Chi tiết booking [CITE: 29]
    @GetMapping("/{id}")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id) or hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable String id) {
        return new ResponseEntity<>(bookingService.findById(id), HttpStatus.OK);
    }

    // POST /api/bookings - Tạo booking mới [CITE: 29]
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO, Authentication authentication) {
        // Tự động gán userId cho booking mới
        String userId = authentication.getName();
        bookingDTO.setUserId(userId); 
        
        BookingDTO newBooking = (BookingDTO) bookingService.create(bookingDTO);
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    // PUT /api/bookings/{id}/cancel - Hủy booking [CITE: 29]
    @PutMapping("/{id}/cancel")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id) or hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> cancelBooking(
            @PathVariable String id, 
            @RequestBody(required = false) Map<String, String> payload,
            Authentication authentication) {
        
        String reason = payload != null ? payload.get("reason") : "User requested cancellation";
        String currentUserId = authentication.getName();

        BookingDTO cancelledBooking = (BookingDTO) bookingService.cancelBooking(id, reason, currentUserId);
        return new ResponseEntity<>(cancelledBooking, HttpStatus.OK);
    }

    // POST /api/bookings/{id}/request-refund - Yêu cầu hoàn tiền [CITE: 29]
    @PostMapping("/{id}/request-refund")
    @PreAuthorize("@webSecurity.isBookingOwner(authentication, #id)")
    public ResponseEntity<BookingDTO> requestRefund(@PathVariable String id) {
        BookingDTO result = (BookingDTO) bookingService.requestRefund(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // POST /api/bookings/preview - Preview booking [CITE: 30]
    @PostMapping("/preview")
    public ResponseEntity<BookingDTO> previewBooking(@RequestBody BookingDTO bookingDTO) {
        // TODO: Gọi service để tính toán giá (chưa lưu DB)
        // Hiện tại chỉ trả về DTO đã tính toán (giả lập)
        return new ResponseEntity<>(bookingDTO, HttpStatus.OK);
    }
}