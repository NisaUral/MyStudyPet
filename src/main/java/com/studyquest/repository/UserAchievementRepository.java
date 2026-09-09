package com.studyquest.repository;

import com.studyquest.entity.AchievementType;
import com.studyquest.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    boolean existsByUserIdAndAchievementType(Long userId, AchievementType achievementType);
    List<UserAchievement> findByUserId(Long userId);
}