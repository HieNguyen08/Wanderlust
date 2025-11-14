package com.wanderlust.api.controller;

import com.wanderlust.api.dto.booking.BookingDTO;
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
@RequestMapping("/api/vendor/bookings")
@PreAuthorize("hasRole('PARTNER')") // Chỉ đối tác (PARTNER) mới được truy cập
public class VendorBookingController {

    private final BookingService bookingService;

    // GET /api/vendor/bookings - Lấy bookings của vendor [CITE: 43]
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getVendorBookings(Authentication authentication) {
        // Giả sử ID của vendor chính là ID của user (đã được gán role PARTNER)
        String vendorId = authentication.getName();
        // TODO: Đảm bảo 'authentication.getName()' trả về đúng User ID (cũng là Vendor ID)
        return new ResponseEntity<>(bookingService.findByVendorId(vendorId), HttpStatus.OK);
    }

    // POST /api/vendor/bookings/{id}/confirm - Confirm booking [CITE: 30, 43]
    @PostMapping("/{id}/confirm")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<BookingDTO> confirmBooking(@PathVariable String id) {
        BookingDTO result = bookingService.confirmBooking(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // POST /api/vendor/bookings/{id}/reject - Reject booking [CITE: 43]
    @PostMapping("/{id}/reject")
    @PreAuthorize("@webSecurity.isBookingVendor(authentication, #id)")
    public ResponseEntity<BookingDTO> rejectBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> payload) {
        
        String reason = payload != null ? payload.get("reason") : "Vendor rejected";
        BookingDTO result = bookingService.rejectBooking(id, reason);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}