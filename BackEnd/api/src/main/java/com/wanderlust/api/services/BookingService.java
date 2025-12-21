package com.wanderlust.api.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.wanderlust.api.dto.BookingDTO;
import com.wanderlust.api.dto.BookingStatisticsDTO;
import com.wanderlust.api.dto.VendorBookingResponse;
import com.wanderlust.api.entity.Activity;
import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.Hotel;
import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.BookingStatus;
import com.wanderlust.api.entity.types.BookingType;
import com.wanderlust.api.entity.types.PaymentMethod;
import com.wanderlust.api.entity.types.PaymentStatus;
import com.wanderlust.api.exception.ResourceNotFoundException;
import com.wanderlust.api.mapper.BookingMapper;
import com.wanderlust.api.repository.ActivityRepository;
import com.wanderlust.api.repository.BookingRepository;
import com.wanderlust.api.repository.CarRentalRepository;
import com.wanderlust.api.repository.HotelRepository;
import com.wanderlust.api.repository.RoomRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ActivityRepository activityRepository;
    private final CarRentalRepository carRentalRepository;
    private final ActivityService activityService;
    private final CarRentalService carRentalService;
    private final MoneyTransferService moneyTransferService;

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

    public List<VendorBookingResponse> findVendorBookingsView(String vendorId) {
        List<Booking> bookings = bookingRepository.findByVendorId(vendorId, defaultSort);
        return bookings.stream()
                .map(this::toVendorBookingResponse)
                .collect(Collectors.toList());
    }

    public VendorBookingResponse getVendorBookingView(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        return toVendorBookingResponse(booking);
    }

    /**
     * Update review flag for a booking
     */
    public BookingDTO updateHasReview(String bookingId, Boolean hasReview) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Default to true if client doesn't supply value
        booking.setHasReview(hasReview != null ? hasReview : Boolean.TRUE);

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toDTO(saved);
    }

    public List<BookingDTO> findRefundRequestedWithCompletedPayment() {
        List<Booking> bookings = bookingRepository.findByStatusAndPaymentStatus(
                BookingStatus.REFUND_REQUESTED,
                PaymentStatus.COMPLETED,
                defaultSort);
        return bookingMapper.toDTOs(bookings);
    }

    public List<BookingDTO> findVendorRefundRequests(String vendorId) {
        List<Booking> bookings = bookingRepository.findByVendorId(vendorId, defaultSort)
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.REFUND_REQUESTED
                        && b.getPaymentStatus() == PaymentStatus.COMPLETED)
                .toList();
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

    // Helper to determine vendor ID for a booking; returns existing vendorId or
    // null when unknown
    private String findVendorIdForBooking(Booking booking) {
        if (booking == null) {
            return null;
        }
        // If vendorId is already set on the booking, use it
        if (booking.getVendorId() != null) {
            return booking.getVendorId();
        }

        // Resolve by hotel or room
        if (booking.getHotelId() != null) {
            return hotelRepository.findById(booking.getHotelId())
                    .map(Hotel::getVendorId)
                    .orElse(null);
        }

        if (booking.getRoomIds() != null && !booking.getRoomIds().isEmpty()) {
            Optional<Room> room = roomRepository.findById(booking.getRoomIds().get(0));
            if (room.isPresent()) {
                String hotelId = room.get().getHotelId();
                if (hotelId != null) {
                    return hotelRepository.findById(hotelId)
                            .map(Hotel::getVendorId)
                            .orElse(null);
                }
            }
        }

        // Resolve by car rental
        if (booking.getCarRentalId() != null) {
            return carRentalRepository.findById(booking.getCarRentalId())
                    .map(CarRental::getVendorId)
                    .orElse(null);
        }

        // Resolve by activity
        if (booking.getActivityId() != null) {
            return activityRepository.findById(booking.getActivityId())
                    .map(Activity::getVendorId)
                    .orElse(null);
        }

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
                        Collectors.counting()));

        // 5. Đếm số lượng booking theo loại
        Map<BookingType, Long> countByType = allBookings.stream()
                .filter(b -> b.getBookingType() != null) // Lọc các giá trị null
                .collect(Collectors.groupingBy(
                        Booking::getBookingType,
                        Collectors.counting()));

        // 6. Tính tổng doanh thu theo trạng thái
        Map<BookingStatus, BigDecimal> revenueByStatus = allBookings.stream()
                .filter(b -> b.getStatus() != null && b.getTotalPrice() != null)
                .collect(Collectors.groupingBy(
                        Booking::getStatus,
                        Collectors.reducing(
                                BigDecimal.ZERO, // Giá trị khởi tạo
                                Booking::getTotalPrice, // Hàm lấy giá trị
                                BigDecimal::add // Hàm cộng dồn
                        )));

        // 7. Trả về DTO
        return new BookingStatisticsDTO(
                totalBookings,
                totalRevenue,
                countByStatus,
                revenueByStatus,
                countByType);
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
    public BookingDTO requestRefund(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        // Kiểm tra thời gian cho phép refund: trước endDate + 24h
        // Nếu không có endDate, cho phép refund (ví dụ: dịch vụ không có thời gian kết
        // thúc cụ thể)
        if (booking.getEndDate() != null) {
            LocalDateTime refundDeadline = booking.getEndDate().plusHours(24);
            if (LocalDateTime.now().isAfter(refundDeadline)) {
                throw new RuntimeException(
                        "Refund deadline has passed. You can only request refund within 24 hours after booking end date.");
            }
        }
        // Nếu endDate = null, cho phép refund bất cứ lúc nào (trước khi hoàn thành)

        booking.setStatus(BookingStatus.REFUND_REQUESTED);
        booking.setCancellationReason(reason);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Admin/Vendor approve refund ---
    public BookingDTO approveRefund(String id, String approvedBy, boolean isVendorApproval) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getStatus() != BookingStatus.REFUND_REQUESTED) {
            throw new RuntimeException("Booking is not in refund requested status");
        }

        boolean vendorApproved = Boolean.TRUE.equals(booking.getVendorRefundApproved()) || isVendorApproval;

        // Xử lý hoàn tiền qua MoneyTransferService
        try {
            moneyTransferService.processRefund(booking.getId(), approvedBy, vendorApproved);
            log.info("✅ Refund approved and processed for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("❌ Failed to process refund for booking {}: {}", booking.getBookingCode(), e.getMessage());
            throw new RuntimeException("Failed to process refund: " + e.getMessage());
        }

        // Cập nhật status booking
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledBy(approvedBy);
        booking.setCancelledAt(LocalDateTime.now());

        // Nếu người phê duyệt là vendor, lưu lại ý kiến của vendor
        if (isVendorApproval) {
            booking.setVendorRefundApproved(true);
        }

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Admin/Vendor reject refund ---
    public BookingDTO rejectRefund(String id, String rejectedBy, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getStatus() != BookingStatus.REFUND_REQUESTED) {
            throw new RuntimeException("Booking is not in refund requested status");
        }

        // Trở về trạng thái CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCancellationReason("Refund rejected: " + reason);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    public BookingDTO updateVendorRefundApproval(String id, String vendorId, boolean approved) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getVendorId() == null) {
            booking.setVendorId(findVendorIdForBooking(booking));
        }

        if (!vendorId.equals(booking.getVendorId())) {
            throw new RuntimeException("Vendor not authorized for this booking");
        }

        if (booking.getStatus() != BookingStatus.REFUND_REQUESTED) {
            throw new RuntimeException("Booking is not in refund requested status");
        }

        booking.setVendorRefundApproved(approved);
        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Xác nhận Booking (Vendor/Admin) ---
    public BookingDTO confirmBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getVendorId() == null) {
            booking.setVendorId(findVendorIdForBooking(booking));
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setVendorConfirmed(true);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    // --- ACTION: Từ chối Booking (Vendor/Admin) ---
    public BookingDTO rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                // THAY ĐỔI TẠI ĐÂY
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getVendorId() == null) {
            booking.setVendorId(findVendorIdForBooking(booking));
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setVendorConfirmed(false);
        booking.setCancellationReason(reason);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    private VendorBookingResponse toVendorBookingResponse(Booking booking) {
        VendorBookingResponse response = new VendorBookingResponse();
        response.setId(booking.getId());
        response.setBookingCode(booking.getBookingCode());

        if (booking.getGuestInfo() != null) {
            response.setCustomer(booking.getGuestInfo().getFullName());
            response.setEmail(booking.getGuestInfo().getEmail());
            response.setPhone(booking.getGuestInfo().getPhone());
        }

        response.setService(resolveServiceName(booking));
        response.setServiceType(
                booking.getBookingType() != null ? booking.getBookingType().name().toLowerCase() : "unknown");
        response.setCheckIn(formatDate(booking.getStartDate()));
        response.setCheckOut(formatDate(booking.getEndDate()));
        response.setGuests(resolveGuestCount(booking));

        response.setStatus(mapStatusForVendor(booking.getStatus()));
        response.setPayment(mapPaymentForVendor(booking.getPaymentStatus()));
        response.setAmount(booking.getTotalPrice());
        response.setBookingDate(formatDateTime(booking.getBookingDate()));

        response.setVendorConfirmed(booking.getVendorConfirmed());
        response.setUserConfirmed(booking.getUserConfirmed());
        response.setAutoCompleted(booking.getAutoCompleted());
        return response;
    }

    private String resolveServiceName(Booking booking) {
        if (booking == null) {
            return "N/A";
        }

        BookingType type = booking.getBookingType();
        if (type == BookingType.HOTEL) {
            if (booking.getHotelId() != null) {
                return hotelRepository.findById(booking.getHotelId())
                        .map(Hotel::getName)
                        .orElse("Hotel " + booking.getHotelId());
            }

            if (booking.getRoomIds() != null && !booking.getRoomIds().isEmpty()) {
                Optional<Room> room = roomRepository.findById(booking.getRoomIds().get(0));
                if (room.isPresent() && room.get().getHotelId() != null) {
                    String hotelId = room.get().getHotelId();
                    return hotelRepository.findById(hotelId)
                            .map(Hotel::getName)
                            .orElse("Hotel " + hotelId);
                }
            }
        } else if (type == BookingType.CAR_RENTAL && booking.getCarRentalId() != null) {
            return carRentalRepository.findById(booking.getCarRentalId())
                    .map(car -> {
                        String brand = Optional.ofNullable(car.getBrand()).orElse("").trim();
                        String model = Optional.ofNullable(car.getModel()).orElse("").trim();
                        String name = (brand + " " + model).trim();
                        return name.isEmpty() ? "Car " + booking.getCarRentalId() : name;
                    })
                    .orElse("Car " + booking.getCarRentalId());
        } else if (type == BookingType.ACTIVITY && booking.getActivityId() != null) {
            return activityRepository.findById(booking.getActivityId())
                    .map(Activity::getName)
                    .orElse("Activity " + booking.getActivityId());
        } else if (type == BookingType.FLIGHT && booking.getFlightId() != null && !booking.getFlightId().isEmpty()) {
            // Handle List<String> flightId - join multiple flight IDs for round-trip
            return "Flight " + String.join(", ", booking.getFlightId());
        }

        return "N/A";
    }

    private int resolveGuestCount(Booking booking) {
        if (booking.getNumberOfGuests() != null) {
            Booking.GuestCount guestCount = booking.getNumberOfGuests();
            int adults = Optional.ofNullable(guestCount.getAdults()).orElse(0);
            int children = Optional.ofNullable(guestCount.getChildren()).orElse(0);
            int infants = Optional.ofNullable(guestCount.getInfants()).orElse(0);
            int total = adults + children + infants;
            if (total > 0) {
                return total;
            }
        }

        if (booking.getSeatCount() != null && booking.getSeatCount() > 0) {
            return booking.getSeatCount();
        }

        return 1;
    }

    private String mapStatusForVendor(BookingStatus status) {
        if (status == null) {
            return "pending";
        }

        switch (status) {
            case CONFIRMED:
                return "confirmed";
            case CANCELLED:
                return "cancelled";
            case COMPLETED:
                return "completed";
            default:
                return "pending";
        }
    }

    private String mapPaymentForVendor(PaymentStatus paymentStatus) {
        if (paymentStatus == PaymentStatus.COMPLETED || paymentStatus == PaymentStatus.REFUNDED) {
            return "paid";
        }
        return "pending";
    }

    private String formatDate(LocalDateTime value) {
        return value != null ? value.toLocalDate().toString() : null;
    }

    private String formatDateTime(LocalDateTime value) {
        return value != null ? value.toString() : null;
    }

    // --- ACTION: Cập nhật trạng thái thanh toán cho Booking ---
    public BookingDTO updatePaymentStatus(String id, PaymentStatus paymentStatus, PaymentMethod paymentMethod) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        booking.setPaymentStatus(paymentStatus);
        if (paymentMethod != null) {
            booking.setPaymentMethod(paymentMethod);
        }

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toDTO(saved);
    }

    // --- ACTION: User confirms booking completion ---
    public BookingDTO completeBooking(String id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        // Verify booking belongs to user
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Booking does not belong to user");
        }

        // Can only complete if booking is confirmed and past end date
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Can only complete confirmed bookings");
        }

        if (booking.getEndDate() != null && LocalDateTime.now().isBefore(booking.getEndDate())) {
            throw new RuntimeException("Cannot complete booking before end date");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setUserConfirmed(true);
        booking.setAutoCompleted(false);

        Booking savedBooking = bookingRepository.save(booking);

        // Chuyển tiền cho vendor/admin sau khi user confirm
        try {
            moneyTransferService.processBookingCompletionTransfer(booking.getId());
            log.info("✅ Money transferred for user-confirmed booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("❌ Failed to transfer money for booking {}: {}", booking.getBookingCode(), e.getMessage());
        }

        return bookingMapper.toDTO(savedBooking);
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
