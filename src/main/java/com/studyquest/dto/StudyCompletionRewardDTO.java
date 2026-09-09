package com.studyquest.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StudyCompletionRewardDTO {
    private int baseCoins;
    private double multiplier;
    private int totalEarnedCoins;
    private int newTotalCoins;
    private int currentStreak;
    private boolean streakIncreased;
    private List<UnlockedAchievementDTO> newlyUnlockedAchievements;
}