package com.studyquest.listener;

import com.studyquest.dto.RoomPresenceMessage;
import com.studyquest.session.RoomSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketDisconnectListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomSessionManager sessionManager;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        if (sessionId == null) return;

        sessionManager.removeSession(sessionId).ifPresent(meta -> {
            log.warn("[Kopma Algılandı] Kullanıcı: {} odadan düştü (Oda: {}). Oturum: {}",
                    meta.getUsername(), meta.getRoomCode(), sessionId);

            // Odaya otomatik LEAVE mesajı oluşturup yayınla
            RoomPresenceMessage leaveMessage = RoomPresenceMessage.builder()
                    .roomCode(meta.getRoomCode())
                    .username(meta.getUsername())
                    .petType(meta.getPetType())
                    .action("LEAVE")
                    .build();

            messagingTemplate.convertAndSend("/topic/room/" + meta.getRoomCode(), leaveMessage);
        });
    }
}