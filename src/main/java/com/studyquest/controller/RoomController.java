package com.studyquest.controller;

import com.studyquest.dto.request.JoinRoomRequest;
import com.studyquest.dto.response.RoomResponse;
import com.studyquest.entity.User;
import com.studyquest.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    // POST /api/rooms/create -> Yeni oda yarat
    @PostMapping("/create")
    public ResponseEntity<RoomResponse> createRoom(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(roomService.createRoom(user.getId()));
    }

    // POST /api/rooms/join -> Kod ile odaya gir
    @PostMapping("/join")
    public ResponseEntity<RoomResponse> joinRoom(
            @Valid @RequestBody JoinRoomRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(roomService.joinRoomByCode(request.getRoomCode(), user.getId()));
    }
}