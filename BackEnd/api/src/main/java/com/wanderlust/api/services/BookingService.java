package com.wanderlust.api.services;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.mapper.BookingMapper;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.dto.BookingStatisticsDTO;

// === CÁC IMPORT ĐỂ LẤY VENDOR ID ===
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RoomRepository;
import com.wanderlust.api.services.ActivityService;
import com.wanderlust.api.services.CarRentalService;

// === IMPORT EXCEPTION MỚI ===
import com.wanderlust.api.exception.ResourceNotFoundException; 

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j; 
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal; 
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class BookingService {

        private final BookingRepository bookingRepository;
        private final BookingMapper bookingMapper;

        private final HotelRepository hotelRepository;
        private final RoomRepository roomRepository;
        private final ActivityService activityService;
        private final CarRentalService carRentalService;
    
    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt");

    // ... (các hàm findAll, findByUserId, findByVendorId không đổi) ...
    public List<BookingDTO> findAll() {
        return bookingMapper.toDTOs(bookingRepository.findAll(defaultSort));
    }
    public List<BookingDTO> findByUserId(String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId, defaultSort); 
        return bookingMapper.toDTOs(bookings);
    }
    public List<BookingDTO> findByVendorId(String vendorId) {
        List<Booking> bookings = bookingRepository.findByVendorId(vendorId, defaultSort);
        return bookingMapper.toDTOs(bookings);
    }
    // ==========================================================

    // --- GET: Chi tiết 1 booking ---
    public BookingDTO findById(String id) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
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
        
        // Logic này đã gọi findVendorIdForBooking
        String vendorId = findVendorIdForBooking(booking);
        booking.setVendorId(vendorId);

        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toDTO(savedBooking);
    }

    // Helper to determine vendor ID for a booking; returns existing vendorId or null when unknown
    private String findVendorIdForBooking(Booking booking) {
        if (booking == null) {
            return null;
        }
        // If vendorId is already set on the booking, use it
        if (booking.getVendorId() != null) {
            return booking.getVendorId();
        }
        // Additional vendor resolution logic (by related entity IDs) can be added here later.
        return null;
    }

    public BookingStatisticsDTO getStatistics() {
        // 1. Tải TẤT CẢ booking (Không hiệu quả cho dữ liệu lớn)
        List<Booking> allBookings = bookingRepository.findAll();

        // 2. Tính tổng số booking
        long totalBookings = allBookings.size();

        // 3. Tính tổng doanh thu (chỉ từ các booking đã COMPLETED)
        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getTotalPrice() != null)
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Đếm số lượng booking theo trạng thái
        Map<BookingStatus, Long> countByStatus = allBookings.stream()
                .filter(b -> b.getStatus() != null) // Lọc các giá trị null (nếu có)
                .collect(Collectors.groupingBy(
                        Booking::getStatus,
                        Collectors.counting()
                ));

        // 5. Đếm số lượng booking theo loại
        Map<BookingType, Long> countByType = allBookings.stream()
                .filter(b -> b.getBookingType() != null) // Lọc các giá trị null
                .collect(Collectors.groupingBy(
                        Booking::getBookingType,
                        Collectors.counting()
                ));

        // 6. Tính tổng doanh thu theo trạng thái
        Map<BookingStatus, BigDecimal> revenueByStatus = allBookings.stream()
                .filter(b -> b.getStatus() != null && b.getTotalPrice() != null)
                .collect(Collectors.groupingBy(
                        Booking::getStatus,
                        Collectors.reducing(
                                BigDecimal.ZERO,      // Giá trị khởi tạo
                                Booking::getTotalPrice, // Hàm lấy giá trị
                                BigDecimal::add       // Hàm cộng dồn
                        )
                ));
        
        // 7. Trả về DTO
        return new BookingStatisticsDTO(
                totalBookings,
                totalRevenue,
                countByStatus,
                revenueByStatus,
                countByType
        );
    }

    // --- POST: Preview Booking (Cho trang checkout) ---
    public BookingDTO preview(BookingDTO bookingDTO) {
        // ... (Logic tính toán không đổi) ...
        Booking booking = bookingMapper.toEntity(bookingDTO);
        String vendorId = findVendorIdForBooking(booking);
        bookingDTO.setVendorId(vendorId); 
        
        if (bookingDTO.getBasePrice() != null) {
            BigDecimal basePrice = bookingDTO.getBasePrice();
            BigDecimal serviceFee = basePrice.multiply(new BigDecimal("0.05"));
            BigDecimal taxes = basePrice.multiply(new BigDecimal("0.08")); 
            BigDecimal total = basePrice.add(serviceFee).add(taxes);
            
            bookingDTO.setFees(serviceFee);
            bookingDTO.setTaxes(taxes);
            bookingDTO.setTotalPrice(total);
            bookingDTO.setCurrency("VND");
        }
        
        return bookingDTO;
    }

    // --- PUT: Update thông tin (Admin) ---
    public BookingDTO update(String id, BookingDTO bookingDTO) {
        Booking existingBooking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        bookingMapper.updateEntityFromDTO(bookingDTO, existingBooking);
        
        Booking savedBooking = bookingRepository.save(existingBooking);
        return bookingMapper.toDTO(savedBooking);
    }

    // --- ACTION: Hủy Booking (User) ---
    public BookingDTO cancelBooking(String id, String reason, String cancelledBy) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

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
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        booking.setStatus(BookingStatus.REFUND_REQUESTED); 
        
        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Xác nhận Booking (Vendor/Admin) ---
    public BookingDTO confirmBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        booking.setStatus(BookingStatus.CONFIRMED); 
        booking.setVendorConfirmed(true);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }
    
    // --- ACTION: Từ chối Booking (Vendor/Admin) ---
    public BookingDTO rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        booking.setStatus(BookingStatus.CANCELLED); 
        booking.setVendorConfirmed(false);
        booking.setCancellationReason(reason);
        
        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- DELETE: Xóa cứng (Admin) ---
    public void delete(String id) {
        if (!bookingRepository.existsById(id)) {
            // THAY ĐỔI TẠI ĐÂY
            throw new ResourceNotFoundException("Booking", "id", id);
        }
        bookingRepository.deleteById(id);
    }
    
    public void deleteAll() {
        bookingRepository.deleteAll();
    }
}

