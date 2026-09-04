package com.studyquest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionResponse {
    private Long sessionId;
    private Integer targetDurationMinutes;
    private Integer actualDurationMinutes;
    private Long earnedCoins;
    private Boolean isCompleted;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Long currentCoinBalance;
}