package com.studyquest.controller;

import com.studyquest.dto.RoomPresenceMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class StudyRoomSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    // Mobil uygulama "/app/room/{roomCode}/activity" adresine mesaj attığında tetiklenir
    @MessageMapping("/room/{roomCode}/activity")
    public void broadcastRoomActivity(
            @DestinationVariable String roomCode,
            @Payload RoomPresenceMessage message) {

        message.setRoomCode(roomCode);
        message.setTimestamp(System.currentTimeMillis());

        // Odaya abone olan herkese "/topic/room/{roomCode}" üzerinden yayılır
        messagingTemplate.convertAndSend("/topic/room/" + roomCode, message);
    }
}