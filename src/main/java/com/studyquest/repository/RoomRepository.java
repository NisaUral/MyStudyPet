package com.studyquest.repository;

import com.studyquest.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomCode(String roomCode);
    Optional<Room> findByOwnerId(Long ownerId);
    boolean existsByRoomCode(String roomCode);
}