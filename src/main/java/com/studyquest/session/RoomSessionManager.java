package com.studyquest.session;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RoomSessionManager {

    @Data
    @AllArgsConstructor
    public static class UserSessionMeta {
        private String username;
        private String roomCode;
        private String petType;
    }

    // sessionId -> UserSessionMeta
    private final ConcurrentHashMap<String, UserSessionMeta> sessionRegistry = new ConcurrentHashMap<>();

    public void registerSession(String sessionId, String username, String roomCode, String petType) {
        sessionRegistry.put(sessionId, new UserSessionMeta(username, roomCode, petType));
    }

    public Optional<UserSessionMeta> getSessionMeta(String sessionId) {
        return Optional.ofNullable(sessionRegistry.get(sessionId));
    }

    public Optional<UserSessionMeta> removeSession(String sessionId) {
        return Optional.ofNullable(sessionRegistry.remove(sessionId));
    }
}