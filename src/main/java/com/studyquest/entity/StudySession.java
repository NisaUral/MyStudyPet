package com.studyquest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer targetDurationMinutes;

    private Integer actualDurationMinutes;

    private Long earnedCoins;

    @Builder.Default
    private Boolean isCompleted = false;

    @CreationTimestamp
    private LocalDateTime startedAt;

    private LocalDateTime endedAt;
}