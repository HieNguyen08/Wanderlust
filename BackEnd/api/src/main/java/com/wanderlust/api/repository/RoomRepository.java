package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByHotelId(String hotelId);

    // Fetch rooms for multiple hotels at once
    List<Room> findByHotelIdIn(List<String> hotelIds);
}