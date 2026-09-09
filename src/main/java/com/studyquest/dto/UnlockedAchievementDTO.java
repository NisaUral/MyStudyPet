package com.studyquest.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnlockedAchievementDTO {
    private String type;
    private String title;
    private String description;
    private int bonusCoins;
}