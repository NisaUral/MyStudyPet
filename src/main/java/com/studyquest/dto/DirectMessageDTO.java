package com.studyquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DirectMessageDTO {
    private String roomCode;
    private String senderUsername;
    private String targetUsername;
    private String content;
    private Long timestamp;
}