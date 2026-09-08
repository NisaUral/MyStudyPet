package com.studyquest.controller;

import com.studyquest.dto.RoomPresenceMessage; // Mevcut DTO'nuz
import com.studyquest.session.RoomSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class RoomPresenceController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomSessionManager sessionManager;

    @MessageMapping("/room/{roomCode}/activity")
    public void handleActivity(
            @DestinationVariable String roomCode,
            @Payload RoomPresenceMessage message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String sessionId = headerAccessor.getSessionId();

        // Kullanıcı odaya katıldığında oturumunu kaydet
        if ("JOIN".equalsIgnoreCase(message.getAction())) {
            sessionManager.registerSession(
                    sessionId,
                    message.getUsername(),
                    roomCode,
                    message.getPetType() != null ? message.getPetType() : "CAT"
            );
            log.info("[WebSocket] Kaydedilen Oturum: {} -> Kullanıcı: {}, Oda: {}", sessionId, message.getUsername(), roomCode);
        } else if ("LEAVE".equalsIgnoreCase(message.getAction())) {
            sessionManager.removeSession(sessionId);
        }

        // Mesajı odadaki diğer tüm istemcilere dağıt
        messagingTemplate.convertAndSend("/topic/room/" + roomCode, message);
    }
}