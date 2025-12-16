package com.wanderlust.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.types.FlightStatus;
import com.wanderlust.api.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Lấy tất cả chuyến bay
     */
    /**
     * Lấy tất cả chuyến bay (có phân trang)
     */
    /**
     * Lấy tất cả chuyến bay (có phân trang và tìm kiếm cho admin)
     */
    public Page<Flight> getAllFlights(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "departureTime"));

        Criteria criteria = new Criteria();

        // FlightStatus status filtering logic if needed (e.g. not displaying
        // cancelled?)
        // For admin we usually want to see everything or maybe filter by query.

        if (StringUtils.hasText(search)) {
            String regex = search.trim();
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("flightNumber").regex(regex, "i"),
                    Criteria.where("airlineName").regex(regex, "i"),
                    Criteria.where("departureCity").regex(regex, "i"),
                    Criteria.where("arrivalCity").regex(regex, "i"),
                    Criteria.where("departureAirportCode").regex(regex, "i"),
                    Criteria.where("arrivalAirportCode").regex(regex, "i"));
            criteria.andOperator(searchCriteria);
        }

        Query query = new Query(criteria).with(pageable);
        List<Flight> flights = mongoTemplate.find(query, Flight.class);
        long total = mongoTemplate.count(Query.of(query).limit(0).skip(0), Flight.class);

        return new PageImpl<>(flights, pageable, total);
    }

    /**
     * Lấy chuyến bay theo ID
     */
    public Optional<Flight> getFlightById(String id) {
        return flightRepository.findById(id);
    }

    /**
     * Lấy chuyến bay theo số hiệu
     */
    public Optional<Flight> getFlightByNumber(String flightNumber) {
        return flightRepository.findByFlightNumber(flightNumber);
    }

    /**
     * Tìm kiếm chuyến bay (Core function cho frontend) - Nâng cao
     * 
     * @param from               - Mã sân bay đi (VD: "SGN")
     * @param to                 - Mã sân bay đến (VD: "HAN")
     * @param date               - Ngày bay (LocalDate)
     * @param directOnly         - Chỉ tìm chuyến bay thẳng?
     * @param airlineCodes       - Lọc theo hãng bay (optional)
     * @param minPrice           - Giá tối thiểu (optional)
     * @param maxPrice           - Giá tối đa (optional)
     * @param cabinClass         - Hạng vé: "economy", "premiumEconomy", "business"
     *                           (optional)
     * @param departureTimeRange - Khung giờ khởi hành: "morning" (6-12h),
     *                           "afternoon" (12-18h), "evening" (18-24h) (optional)
     * @return Danh sách chuyến bay phù hợp
     */
    public Page<Flight> searchFlights(
            String from,
            String to,
            LocalDate date,
            boolean directOnly,
            List<String> airlineCodes,
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice,
            String cabinClass,
            String departureTimeRange,
            int page,
            int size)
    {

        Pageable pageable = PageRequest.of(page, size);

        // Tạo khoảng thời gian cho cả ngày
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Tìm chuyến bay theo tuyến và ngày (có phân trang tại database level)
        Page<Flight> flightsPage = flightRepository.searchFlights(
                from,
                to,
                startOfDay,
                endOfDay,
                pageable);

        // NOTE: Các bộ lọc bên dưới (airline, price, time...) được thực hiện in-memory
        // sau khi query DB.
        // Điều này SẼ LÀM SAI phân trang của Spring Data (trả về Page).
        // Page returned từ Repository chỉ reflect query DB. Filter list sẽ làm giảm số
        // lượng item.
        // Để làm đúng, cần move toàn bộ filter vào Mongo Query (@Query hoặc Criteria).
        // Tuy nhiên, với cấu trúc hiện tại và yêu cầu bài toán, ta sẽ thực hiện filter
        // trên list kết quả
        // VÀ chấp nhận rằng "Page" trả về có thể ít hơn "Size" dù còn page sau.
        // HOẶC tốt hơn: Fetch all matching route/date, filter in memory, sau đó mới
        // pagination thủ công.

        // Cách tiếp cận an toàn nhất hiện tại mà không viết lại query phức tạp:
        // 1. Fetch List (dùng method cũ/mới return List)
        // 2. Filter list in memory
        // 3. Convert List to Page thủ công.

        // Re-using Repository method returning List (cần thêm method này vào repo hoặc
        // cast)
        // Nhưng repo đã sửa return Page. Ta cần 1 method return List hoặc dùng Page
        // size lớn.
        // Tạm thời để đơn giản và đúng logic filter:
        // -> Sửa lại Repository thêm method searchFlightsList trả về List<Flight>
        // -> Filter
        // -> Manual Pagination logic

        // Assuming we revert Repository change or add new method.
        // Let's implement manual pagination logic here to keep filters working
        // correctly.

        // Sửa lại: Gọi findAll hoặc searchFlights không phân trang từ repo (cần thêm
        // method hoặc sửa lại).
        // Nhưng tôi đã lỡ sửa repo thành Page.
        // Fix: Sử dụng Page size cực lớn để fetch all cho search này, hoặc thêm method
        // mới vào repo.
        // Tôi sẽ thêm method mới vào FlightService dùng Page request, nhưng vì logic
        // filter phức tạp,
        // tôi nên query tất cả (matching route+date) rồi filter, rồi paginate.

        // Để không sửa repo nhiều lần, tôi sẽ dùng PageRequest.of(0, 1000) (như user
        // request max 1000)
        // vào hàm searchFlights của Repo. Sau đó filter và slice list.

        Page<Flight> rawResult = flightRepository.searchFlights(from, to, startOfDay, endOfDay,
                PageRequest.of(0, 1000));
        List<Flight> filtered = rawResult.getContent();

        // ... (Filter logic giữ nguyên) ...

        // Filter directOnly
        if (directOnly) {
            filtered = filtered.stream()
                    .filter(Flight::getIsDirect)
                    .collect(Collectors.toList());
        }

        // ... (Other filters) ...

        if (airlineCodes != null && !airlineCodes.isEmpty()) {
            filtered = filtered.stream()
                    .filter(f -> airlineCodes.contains(f.getAirlineCode()))
                    .collect(Collectors.toList());
        }

        if (minPrice != null || maxPrice != null) {
            filtered = filtered.stream()
                    .filter(f -> {
                        String targetCabin = (cabinClass != null && !cabinClass.isEmpty()) ? cabinClass : "economy";
                        if (f.getCabinClasses() != null && f.getCabinClasses().containsKey(targetCabin)) {
                            Flight.CabinClassInfo cabinInfo = f.getCabinClasses().get(targetCabin);
                            if (cabinInfo != null && cabinInfo.getFromPrice() != null) {
                                java.math.BigDecimal price = cabinInfo.getFromPrice();
                                if (minPrice != null && price.compareTo(minPrice) < 0)
                                    return false;
                                if (maxPrice != null && price.compareTo(maxPrice) > 0)
                                    return false;
                            }
                        }
                        return true;
                    }).collect(Collectors.toList());
        }

        if (departureTimeRange != null && !departureTimeRange.isEmpty()) {
            final String[] ranges = departureTimeRange.toLowerCase().split(",");
            filtered = filtered.stream()
                    .filter(f -> {
                        if (f.getDepartureTime() == null)
                            return true;
                        int hour = f.getDepartureTime().getHour();
                        for (String range : ranges) {
                            switch (range.trim()) {
                                case "morning":
                                case "early":
                                    if (hour >= 0 && hour < 12)
                                        return true;
                                    break;
                                case "afternoon":
                                case "noon":
                                    if (hour >= 12 && hour < 18)
                                        return true;
                                    break;
                                case "evening":
                                case "night":
                                    if (hour >= 18 && hour < 24)
                                        return true;
                                    break;
                            }
                        }
                        return false;
                    }).collect(Collectors.toList());
        }

        if (cabinClass != null && !cabinClass.isEmpty()) {
            filtered = filtered.stream()
                    .filter(f -> {
                        if (f.getCabinClasses() != null && f.getCabinClasses().containsKey(cabinClass)) {
                            Flight.CabinClassInfo cabinInfo = f.getCabinClasses().get(cabinClass);
                            return cabinInfo != null && cabinInfo.getAvailable() != null && cabinInfo.getAvailable();
                        }
                        return false;
                    }).collect(Collectors.toList());
        }

        // Manual Pagination
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<Flight> pageContent = filtered.subList(start, end);

        return new org.springframework.data.domain.PageImpl<>(
                pageContent, pageable, filtered.size());
    }

    /**
     * Lấy các chuyến bay gần nhất sắp khởi hành
     */
    public List<Flight> getNearestFlights(int limit) {
        LocalDateTime now = LocalDateTime.now();
        // Lấy chuyến bay từ thời điểm hiện tại trở đi
        return flightRepository.findByDepartureTimeAfterOrderByDepartureTimeAsc(now)
                .stream()
                .filter(f -> f.getStatus() == FlightStatus.SCHEDULED)
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chuyến bay theo nhiều ngày (cho lịch giá 7 ngày)
     */
    public List<Flight> getFlightsByDateRange(
            String from,
            String to,
            LocalDate startDate,
            LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        return flightRepository.findByDepartureTimeBetween(start, end)
                .stream()
                .filter(f -> f.getDepartureAirportCode().equals(from) &&
                        f.getArrivalAirportCode().equals(to) &&
                        f.getStatus() == FlightStatus.SCHEDULED)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chuyến bay theo hãng
     */
    public List<Flight> getFlightsByAirline(String airlineCode) {
        return flightRepository.findByAirlineCode(airlineCode);
    }

    /**
     * Lấy chuyến bay quốc tế/nội địa
     */
    public List<Flight> getFlightsByType(Boolean isInternational) {
        return flightRepository.findByIsInternational(isInternational);
    }

    /**
     * Tạo chuyến bay mới
     */
    public Flight createFlight(Flight flight) {
        // Set default values
        if (flight.getStatus() == null) {
            flight.setStatus(FlightStatus.SCHEDULED);
        }
        if (flight.getIsDirect() == null) {
            flight.setIsDirect(flight.getStops() == null || flight.getStops() == 0);
        }

        return flightRepository.save(flight);
    }

    /**
     * Cập nhật chuyến bay
     */
    public Flight updateFlight(String id, Flight flightDetails) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));

        // Update fields
        flight.setFlightNumber(flightDetails.getFlightNumber());
        flight.setAirlineCode(flightDetails.getAirlineCode());
        flight.setAirlineName(flightDetails.getAirlineName());
        flight.setDepartureAirportCode(flightDetails.getDepartureAirportCode());
        flight.setArrivalAirportCode(flightDetails.getArrivalAirportCode());
        flight.setDepartureTime(flightDetails.getDepartureTime());
        flight.setArrivalTime(flightDetails.getArrivalTime());
        flight.setCabinClasses(flightDetails.getCabinClasses());
        flight.setStatus(flightDetails.getStatus());
        flight.setAvailableSeats(flightDetails.getAvailableSeats());

        return flightRepository.save(flight);
    }

    /**
     * Xóa chuyến bay
     */
    public void deleteFlight(String id) {
        flightRepository.deleteById(id);
    }

    /**
     * Cập nhật số ghế còn trống
     */
    public Flight updateAvailableSeats(String flightId, Integer seatsBooked) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        int currentAvailable = flight.getAvailableSeats();
        flight.setAvailableSeats(currentAvailable - seatsBooked);

        return flightRepository.save(flight);
    }

    /**
     * Giảm số ghế trống, giới hạn không xuống dưới 0
     */
    public Flight decrementAvailableSeats(String flightId, Integer count) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        int currentAvailable = flight.getAvailableSeats() == null ? 0 : flight.getAvailableSeats();
        int decrement = (count == null || count <= 0) ? 1 : count;
        int updated = Math.max(0, currentAvailable - decrement);
        flight.setAvailableSeats(updated);
        return flightRepository.save(flight);
    }

    /**
     * Cập nhật trạng thái chuyến bay
     */
    public Flight updateStatus(String flightId, FlightStatus status) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        flight.setStatus(status);
        return flightRepository.save(flight);
    }
}
