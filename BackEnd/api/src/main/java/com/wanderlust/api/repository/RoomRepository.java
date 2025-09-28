package com.wanderlust.api.repository;

import com.wanderlust.api.entity.Room;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, String>{
}
