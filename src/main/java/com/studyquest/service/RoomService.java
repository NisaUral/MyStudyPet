package com.studyquest.service;

import com.studyquest.dto.response.RoomResponse;
import com.studyquest.entity.Room;
import com.studyquest.entity.User;
import com.studyquest.repository.RoomRepository;
import com.studyquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    // Seçenek 1: Kullanıcı kendi odasını oluşturmak isterse
    @Transactional
    public RoomResponse createRoom(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        if (roomRepository.findByOwnerId(userId).isPresent()) {
            throw new RuntimeException("Zaten bir çalışma odanız bulunmaktadır.");
        }

        String uniqueRoomCode = generateUniqueRoomCode();
        Room room = Room.builder()
                .roomCode(uniqueRoomCode)
                .wallpaperId("default_wallpaper")
                .floorId("default_floor")
                .owner(user)
                .build();

        room = roomRepository.save(room);

        return RoomResponse.builder()
                .roomId(room.getId())
                .roomCode(room.getRoomCode())
                .ownerUsername(user.getUsername())
                .wallpaperId(room.getWallpaperId())
                .floorId(room.getFloorId())
                .isOwner(true)
                .build();
    }

    // Seçenek 2: Kullanıcı arkadaşının oda kodu ile odaya girmek isterse
    public RoomResponse joinRoomByCode(String roomCode, Long currentUserId) {
        Room room = roomRepository.findByRoomCode(roomCode.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Bu koda ait aktif bir çalışma odası bulunamadı."));

        return RoomResponse.builder()
                .roomId(room.getId())
                .roomCode(room.getRoomCode())
                .ownerUsername(room.getOwner().getUsername())
                .wallpaperId(room.getWallpaperId())
                .floorId(room.getFloorId())
                .isOwner(room.getOwner().getId().equals(currentUserId))
                .build();
    }

    private String generateUniqueRoomCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            code = sb.toString();
        } while (roomRepository.existsByRoomCode(code));
        return code;
    }
}