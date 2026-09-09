package com.studyquest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(
    name = "user_achievements",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "achievement_type"})
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