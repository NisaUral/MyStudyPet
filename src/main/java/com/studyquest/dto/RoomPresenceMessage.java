package com.studyquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomPresenceMessage {
    private String roomCode;
    private String username;
    private String petType;
    private String action; // "JOIN", "LEAVE", "START_STUDY", "STOP_STUDY"
    private Integer targetMinutes;
    private Long timestamp;
}