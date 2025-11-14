package com.wanderlust.api.services;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.mapper.BookingMapper;
import com.wanderlust.api.repository.BookingRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    
    // Sắp xếp mặc định: mới nhất lên trước
    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt");

    // --- GET: Lấy tất cả (Admin) ---
    public List<BookingDTO> findAll() {
        return bookingMapper.toDTOs(bookingRepository.findAll(defaultSort));
    }

    // --- GET: Lấy theo User ID (Cho lịch sử đặt vé) [ĐÃ CẬP NHẬT] ---
    public List<BookingDTO> findByUserId(String userId) {
        // Sử dụng phương thức repository hiệu quả, không dùng stream.filter()
        List<Booking> bookings = bookingRepository.findByUserId(userId, defaultSort);
        return bookingMapper.toDTOs(bookings);
    }
    
    // --- GET: Lấy theo Vendor ID (Cho dashboard của vendor) [MỚI] ---
    public List<BookingDTO> findByVendorId(String vendorId) {
        List<Booking> bookings = bookingRepository.findByVendorId(vendorId, defaultSort);
        return bookingMapper.toDTOs(bookings);
    }

    // --- GET: Chi tiết 1 booking ---
    public BookingDTO findById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id " + id));
        return bookingMapper.toDTO(booking);
    }

    // --- POST: Tạo mới Booking ---
    public BookingDTO create(BookingDTO bookingDTO) {
        Booking booking = bookingMapper.toEntity(bookingDTO);
        
        String code = "WL" + System.currentTimeMillis(); 
        booking.setBookingCode(code);
        
        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING);
        }
        booking.setBookingDate(LocalDateTime.now());
        
        // Gán vendorId (ví dụ lấy từ flightId, hotelId...)
        // TODO: Thêm logic để tự động lấy vendorId từ service (flight, hotel...)
        // booking.setVendorId(findVendorIdFromService(bookingDTO));

        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toDTO(savedBooking);
    }

    // --- PUT: Update thông tin (Admin) ---
    public BookingDTO update(String id, BookingDTO bookingDTO) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id " + id));

        bookingMapper.updateEntityFromDTO(bookingDTO, existingBooking);
        
        Booking savedBooking = bookingRepository.save(existingBooking);
        return bookingMapper.toDTO(savedBooking);
    }

    // --- ACTION: Hủy Booking (User) ---
    public BookingDTO cancelBooking(String id, String reason, String cancelledBy) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking.setCancelledBy(cancelledBy);
        booking.setCancelledAt(LocalDateTime.now());

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Yêu cầu hoàn tiền (User) ---
    public BookingDTO requestRefund(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.REFUND_REQUESTED);
        
        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Xác nhận Booking (Vendor/Admin) ---
    public BookingDTO confirmBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setVendorConfirmed(true);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }
    
    // --- ACTION: Từ chối Booking (Vendor/Admin) [MỚI] ---
    public BookingDTO rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED); // Hoặc một status "REJECTED" nếu có
        booking.setVendorConfirmed(false);
        booking.setCancellationReason(reason);
        
        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- DELETE: Xóa cứng (Admin) ---
    public void delete(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id " + id);
        }
        bookingRepository.deleteById(id);
    }
    
    public void deleteAll() {
        bookingRepository.deleteAll();
    }
}