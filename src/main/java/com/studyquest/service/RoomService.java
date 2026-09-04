package com.studyquest.service;

import com.studyquest.dto.request.PlacedFurnitureDto;
import com.studyquest.dto.request.SaveRoomLayoutRequest;
import com.studyquest.dto.response.RoomDetailResponse;
import com.studyquest.dto.response.RoomResponse;
import com.studyquest.entity.PlacedFurniture;
import com.studyquest.entity.Room;
import com.studyquest.entity.User;
import com.studyquest.repository.RoomRepository;
import com.studyquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

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

    @Transactional(readOnly = true)
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

    @Transactional
    public RoomDetailResponse saveRoomLayout(Long userId, SaveRoomLayoutRequest request) {
        final Room room = roomRepository.findByOwnerId(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcıya ait bir oda bulunamadı."));

        if (request.getWallpaperId() != null) {
            room.setWallpaperId(request.getWallpaperId());
        }
        if (request.getFloorId() != null) {
            room.setFloorId(request.getFloorId());
        }

        room.getPlacedFurnitures().clear();

        List<PlacedFurniture> newFurnitures = request.getFurnitures().stream()
                .map(dto -> PlacedFurniture.builder()
                        .itemId(dto.getItemId())
                        .gridX(dto.getGridX())
                        .gridY(dto.getGridY())
                        .rotation(dto.getRotation())
                        .room(room)
                        .build())
                .toList();

        room.getPlacedFurnitures().addAll(newFurnitures);
        Room savedRoom = roomRepository.save(room);

        return mapToDetailResponse(savedRoom, true);
    }

    @Transactional(readOnly = true)
    public RoomDetailResponse getRoomByCode(String roomCode, Long currentUserId) {
        Room room = roomRepository.findByRoomCode(roomCode.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Bu koda ait çalışma odası bulunamadı."));

        boolean isOwner = room.getOwner().getId().equals(currentUserId);
        return mapToDetailResponse(room, isOwner);
    }

    private RoomDetailResponse mapToDetailResponse(Room room, boolean isOwner) {
        List<PlacedFurnitureDto> furnitureDtos = room.getPlacedFurnitures().stream()
                .map(f -> PlacedFurnitureDto.builder()
                        .itemId(f.getItemId())
                        .gridX(f.getGridX())
                        .gridY(f.getGridY())
                        .rotation(f.getRotation())
                        .build())
                .toList();

        return RoomDetailResponse.builder()
                .roomId(room.getId())
                .roomCode(room.getRoomCode())
                .ownerUsername(room.getOwner().getUsername())
                .wallpaperId(room.getWallpaperId())
                .floorId(room.getFloorId())
                .isOwner(isOwner)
                .furnitures(furnitureDtos)
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