package com.wanderlust.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.types.FlightStatus;
import com.wanderlust.api.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    /**
     * Lấy tất cả chuyến bay
     */
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
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
     * @param from - Mã sân bay đi (VD: "SGN")
     * @param to - Mã sân bay đến (VD: "HAN")
     * @param date - Ngày bay (LocalDate)
     * @param directOnly - Chỉ tìm chuyến bay thẳng?
     * @param airlineCodes - Lọc theo hãng bay (optional)
     * @param minPrice - Giá tối thiểu (optional)
     * @param maxPrice - Giá tối đa (optional)
     * @param cabinClass - Hạng vé: "economy", "premiumEconomy", "business" (optional)
     * @param departureTimeRange - Khung giờ khởi hành: "morning" (6-12h), "afternoon" (12-18h), "evening" (18-24h) (optional)
     * @return Danh sách chuyến bay phù hợp
     */
    public List<Flight> searchFlights(
            String from,
            String to,
            LocalDate date,
            Boolean directOnly,
            List<String> airlineCodes,
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice,
            String cabinClass,
            String departureTimeRange
    ) {
        // Tạo khoảng thời gian cho cả ngày
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Tìm chuyến bay theo tuyến và ngày
        List<Flight> flights = flightRepository.searchFlights(
                from,
                to,
                startOfDay,
                endOfDay
        );

        // Lọc theo direct flight nếu cần
        if (directOnly != null && directOnly) {
            flights = flights.stream()
                    .filter(Flight::getIsDirect)
                    .collect(Collectors.toList());
        }

        // Lọc theo hãng bay nếu có
        if (airlineCodes != null && !airlineCodes.isEmpty()) {
            flights = flights.stream()
                    .filter(f -> airlineCodes.contains(f.getAirlineCode()))
                    .collect(Collectors.toList());
        }

        // Lọc theo giá
        if (minPrice != null || maxPrice != null) {
            flights = flights.stream()
                    .filter(f -> {
                        // Lấy giá thấp nhất của cabin class được chọn (hoặc economy nếu không chọn)
                        String targetCabin = (cabinClass != null && !cabinClass.isEmpty()) ? cabinClass : "economy";
                        
                        if (f.getCabinClasses() != null && f.getCabinClasses().containsKey(targetCabin)) {
                            Flight.CabinClassInfo cabinInfo = f.getCabinClasses().get(targetCabin);
                            if (cabinInfo != null && cabinInfo.getFromPrice() != null) {
                                java.math.BigDecimal price = cabinInfo.getFromPrice();
                                
                                // Kiểm tra khoảng giá
                                if (minPrice != null && price.compareTo(minPrice) < 0) {
                                    return false;
                                }
                                if (maxPrice != null && price.compareTo(maxPrice) > 0) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        // Lọc theo khung giờ khởi hành
        if (departureTimeRange != null && !departureTimeRange.isEmpty()) {
            flights = flights.stream()
                    .filter(f -> {
                        if (f.getDepartureTime() == null) return true;
                        
                        int hour = f.getDepartureTime().getHour();
                        
                        switch (departureTimeRange.toLowerCase()) {
                            case "morning":
                            case "early":
                                return hour >= 0 && hour < 12;
                            case "afternoon":
                            case "noon":
                                return hour >= 12 && hour < 18;
                            case "evening":
                            case "night":
                                return hour >= 18 && hour < 24;
                            default:
                                return true;
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Lọc theo cabin class availability
        if (cabinClass != null && !cabinClass.isEmpty()) {
            flights = flights.stream()
                    .filter(f -> {
                        if (f.getCabinClasses() != null && f.getCabinClasses().containsKey(cabinClass)) {
                            Flight.CabinClassInfo cabinInfo = f.getCabinClasses().get(cabinClass);
                            return cabinInfo != null && cabinInfo.getAvailable() != null && cabinInfo.getAvailable();
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
        }

        return flights;
    }

    /**
     * Lấy chuyến bay theo nhiều ngày (cho lịch giá 7 ngày)
     */
    public List<Flight> getFlightsByDateRange(
            String from,
            String to,
            LocalDate startDate,
            LocalDate endDate
    ) {
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
     * Cập nhật trạng thái chuyến bay
     */
    public Flight updateStatus(String flightId, FlightStatus status) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        flight.setStatus(status);
        return flightRepository.save(flight);
    }
}
