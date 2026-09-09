package com.studyquest.service;

import com.studyquest.dto.StudyCompletionRewardDTO;
import com.studyquest.dto.UnlockedAchievementDTO;
import com.studyquest.entity.AchievementType;
import com.studyquest.entity.User;
import com.studyquest.entity.UserAchievement;
import com.studyquest.exception.BadRequestException;
import com.studyquest.repository.UserAchievementRepository;
import com.studyquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StreakAndRewardService {

    private final UserRepository userRepository;
    private final UserAchievementRepository achievementRepository;

    @Transactional
    public StudyCompletionRewardDTO processSessionCompletion(String username, int durationMinutes) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Kullanıcı bulunamadı"));

        LocalDate today = LocalDate.now(ZoneId.of("Europe/Istanbul"));
        LocalDate lastDate = user.getLastStudyDate();
        boolean streakIncreased = false;

        // 1. Günlük Streak (Seri) Kontrolü
        if (lastDate == null) {
            user.setCurrentStreak(1);
            streakIncreased = true;
        } else if (lastDate.equals(today.minusDays(1))) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
            streakIncreased = true;
        } else if (!lastDate.equals(today)) {
            // 1 günden fazla ara verilmişse seri sıfırlanıp 1 olur
            user.setCurrentStreak(1);
            streakIncreased = true;
        }
        user.setLastStudyDate(today);

        // 2. Çarpan (Multiplier) & Coin Hesabı
        double multiplier = calculateMultiplier(user.getCurrentStreak());
        int baseCoins = (int) Math.round((durationMinutes / 60.0) * 100);
        int totalCoins = (int) Math.round(baseCoins * multiplier);

        // 3. Başarım (Achievements) Kontrolleri
        List<UnlockedAchievementDTO> unlockedList = new ArrayList<>();
        LocalTime nowTime = LocalTime.now(ZoneId.of("Europe/Istanbul"));

        // FIRST_FOCUS
        checkAndUnlock(user, AchievementType.FIRST_FOCUS, unlockedList);

        // STREAK_3 & STREAK_7
        if (user.getCurrentStreak() >= 3) {
            checkAndUnlock(user, AchievementType.STREAK_3, unlockedList);
        }
        if (user.getCurrentStreak() >= 7) {
            checkAndUnlock(user, AchievementType.STREAK_7, unlockedList);
        }

        // NIGHT_OWL (00:00 - 05:00)
        if (nowTime.isAfter(LocalTime.MIDNIGHT) && nowTime.isBefore(LocalTime.of(5, 0))) {
            checkAndUnlock(user, AchievementType.NIGHT_OWL, unlockedList);
        }

        // Başarımlardan gelen ekstra bonus coinleri ekle
        int achievementBonusTotal = unlockedList.stream().mapToInt(UnlockedAchievementDTO::getBonusCoins).sum();
        int finalEarnedCoins = totalCoins + achievementBonusTotal;

        int userCoins = user.getCoins() != null ? user.getCoins() : 0;
        user.setCoins(userCoins + finalEarnedCoins);
        userRepository.save(user);

        log.info("[Ödül Dağıtımı] Kullanıcı: {} | Süre: {} dk | Seri: {} | Kazanılan: {} Coin",
                username, durationMinutes, user.getCurrentStreak(), finalEarnedCoins);

        return StudyCompletionRewardDTO.builder()
                .baseCoins(baseCoins)
                .multiplier(multiplier)
                .totalEarnedCoins(finalEarnedCoins)
                .newTotalCoins(user.getCoins())
                .currentStreak(user.getCurrentStreak())
                .streakIncreased(streakIncreased)
                .newlyUnlockedAchievements(unlockedList)
                .build();
    }

    private double calculateMultiplier(int streakDays) {
        if (streakDays >= 30) return 2.0;
        if (streakDays >= 7) return 1.5;
        if (streakDays >= 3) return 1.25;
        return 1.0;
    }

    private void checkAndUnlock(User user, AchievementType type, List<UnlockedAchievementDTO> unlockedList) {
        if (!achievementRepository.existsByUserIdAndAchievementType(user.getId(), type)) {
            UserAchievement achievement = UserAchievement.builder()
                    .user(user)
                    .achievementType(type)
                    .unlockedAt(Instant.now())
                    .build();
            achievementRepository.save(achievement);

            unlockedList.add(UnlockedAchievementDTO.builder()
                    .type(type.name())
                    .title(type.getTitle())
                    .description(type.getDescription())
                    .bonusCoins(type.getBonusCoins())
                    .build());
        }
    }
}