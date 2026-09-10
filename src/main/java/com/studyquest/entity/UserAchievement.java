package com.studyquest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
// DİKKAT: "import com.studyquest.model.AchievementType;" satırı SİLİNDİ!

@Entity
@Table(
    name = "user_achievements",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "achievement_type"})
    },
    indexes = {
        @Index(name = "idx_user_achievement_user_id", columnList = "user_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_type", nullable = false)
    private AchievementType achievementType;

    @Column(nullable = false)
    private Instant unlockedAt;
}