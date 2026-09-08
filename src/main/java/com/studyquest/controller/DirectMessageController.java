package com.studyquest.controller;

import com.studyquest.dto.DirectMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Slf4j
@Controller
@RequiredArgsConstructor
public class DirectMessageController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * İstemci gönderim adresi: /app/room/{roomCode}/direct-message
     */
    @MessageMapping("/room/{roomCode}/direct-message")
    public void sendDirectMessage(
            @DestinationVariable String roomCode,
            @Payload DirectMessageDTO messageDTO
    ) {
        // Zaman damgası ekleme
        messageDTO.setTimestamp(Instant.now().toEpochMilli());
        messageDTO.setRoomCode(roomCode);

        log.info("[DM] Oda: {}, Gönderen: {}, Alıcı: {}, İçerik: {}", 
                roomCode, messageDTO.getSenderUsername(), messageDTO.getTargetUsername(), messageDTO.getContent());

        // 1. Hedef kullanıcının özel dinleme kanalına ilet
        // İstemcinin abone olacağı kanal: /topic/room/{roomCode}/private/{targetUsername}
        String targetDestination = String.format("/topic/room/%s/private/%s", roomCode, messageDTO.getTargetUsername());
        messagingTemplate.convertAndSend(targetDestination, messageDTO);

        // 2. Gönderenin kendi ekranında da anında güncellenmesi için gönderenin kanalına da ilet
        String senderDestination = String.format("/topic/room/%s/private/%s", roomCode, messageDTO.getSenderUsername());
        messagingTemplate.convertAndSend(senderDestination, messageDTO);
    }
}