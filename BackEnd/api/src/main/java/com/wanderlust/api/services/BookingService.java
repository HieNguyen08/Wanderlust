package com.wanderlust.api.services;

import com.wanderlust.api.entity.Booking;
import com.wanderlust.api.repository.BookingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class BookingService implements BaseServices<Booking> {

    private final BookingRepository bookingRepository;

    // Get all bookings
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    // Add a booking
    public Booking create(Booking booking) {
        return bookingRepository.insert(booking);
    }

    // Update an existing booking
    public Booking update(Booking booking) {
        Booking updatedBooking = bookingRepository.findById(booking.getBooking_Id())
                .orElseThrow(() -> new RuntimeException("Booking not found with id " + booking.getBooking_Id()));

        if (booking.getBooking_Type() != null) updatedBooking.setBooking_Type(booking.getBooking_Type());
        if (booking.getBooking_Date() != null) updatedBooking.setBooking_Date(booking.getBooking_Date());
        if (booking.getStatus() != null) updatedBooking.setStatus(booking.getStatus());
        if (booking.getTotal_Price() != null) updatedBooking.setTotal_Price(booking.getTotal_Price());

        return bookingRepository.save(updatedBooking);
    }

    // Delete a booking by ID
    public void delete(String id) {
        if (bookingRepository.findById(id).isPresent()) {
            bookingRepository.deleteById(id);
        } else {
            throw new RuntimeException("Booking not found with id " + id);
        }
    }

    // Delete all bookings
    public void deleteAll() {
        bookingRepository.deleteAll();
    }

    // Get a specific booking by id
    public Booking findByID(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id " + id));
    }
}