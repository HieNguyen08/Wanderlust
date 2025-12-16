package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Flight;
import com.wanderlust.api.entity.types.FlightStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface FlightRepository extends MongoRepository<Flight, String> {

        // Tìm theo số hiệu chuyến bay
        Optional<Flight> findByFlightNumber(String flightNumber);

        // Tìm theo hãng bay
        List<Flight> findByAirlineCode(String airlineCode);

        // Tìm chuyến bay theo tuyến (from -> to)
        List<Flight> findByDepartureAirportCodeAndArrivalAirportCode(
                        String departureCode,
                        String arrivalCode);

        // Tìm chuyến bay theo tuyến và ngày
        @Query("{ 'departureAirportCode': ?0, 'arrivalAirportCode': ?1, " +
                        "'departureTime': { $gte: ?2, $lt: ?3 }, 'status': ?4 }")
        List<Flight> findByRouteAndDate(
                        String departureCode,
                        String arrivalCode,
                        LocalDateTime startOfDay,
                        LocalDateTime endOfDay,
                        FlightStatus status);

        // Tìm chuyến bay direct (bay thẳng)
        List<Flight> findByDepartureAirportCodeAndArrivalAirportCodeAndIsDirect(
                        String departureCode,
                        String arrivalCode,
                        Boolean isDirect);

        // Tìm theo trạng thái
        List<Flight> findByStatus(FlightStatus status);

        // Tìm chuyến bay quốc tế
        List<Flight> findByIsInternational(Boolean isInternational);

        // Tìm chuyến bay trong khoảng thời gian
        List<Flight> findByDepartureTimeBetween(
                        LocalDateTime startTime,
                        LocalDateTime endTime);

        // Tìm chuyến bay còn chỗ
        @Query("{ 'availableSeats': { $gt: 0 }, 'status': 'SCHEDULED' }")
        List<Flight> findAvailableFlights();

        // Search flights with filters
        @Query("{ 'departureAirportCode': ?0, 'arrivalAirportCode': ?1, " +
                        "'departureTime': { $gte: ?2, $lt: ?3 }, " +
                        "'availableSeats': { $gt: 0 }, " +
                        "'status': 'SCHEDULED' }")
        Page<Flight> searchFlights(
                        String from,
                        String to,
                        LocalDateTime startOfDay,
                        LocalDateTime endOfDay,
                        Pageable pageable);

        // Tìm chuyến bay sắp tới
        List<Flight> findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime time);
}
