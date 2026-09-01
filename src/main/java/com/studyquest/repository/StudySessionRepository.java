package com.studyquest.repository;

import com.studyquest.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserIdOrderByStartedAtDesc(Long userId);
    
    // Kullanıcının tamamlanmamış aktif çalışma seansını bulmak için
    Optional<StudySession> findByUserIdAndIsCompletedFalse(Long userId);
}