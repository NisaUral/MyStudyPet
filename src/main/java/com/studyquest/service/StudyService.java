package com.studyquest.service;

import com.studyquest.dto.request.StartStudyRequest;
import com.studyquest.dto.response.StudySessionResponse;
import com.studyquest.entity.StudySession;
import com.studyquest.entity.User;
import com.studyquest.repository.StudySessionRepository;
import com.studyquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    // 1 saat çalışma = 100 coin (Dakika başına ~1.66 coin tabanı)
    private static final double COIN_PER_MINUTE = 100.0 / 60.0;

    @Transactional
    public StudySessionResponse startSession(Long userId, StartStudyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        // Halihazırda devam eden aktif bir oturum var mı kontrolü
        studySessionRepository.findByUserIdAndIsCompletedFalse(userId).ifPresent(s -> {
            throw new RuntimeException("Devam eden bir çalışma oturumunuz zaten bulunmaktadır.");
        });

        StudySession session = StudySession.builder()
                .user(user)
                .targetDurationMinutes(request.getTargetDurationMinutes())
                .actualDurationMinutes(0)
                .earnedCoins(0L)
                .isCompleted(false)
                .startedAt(LocalDateTime.now())
                .build();

        session = studySessionRepository.save(session);
        return mapToResponse(session, user.getCoinBalance());
    }

    @Transactional
    public StudySessionResponse endSession(Long userId, boolean isEarlyStop) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        StudySession session = studySessionRepository.findByUserIdAndIsCompletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Aktif bir çalışma oturumu bulunamadı."));

        LocalDateTime now = LocalDateTime.now();
        long elapsedSeconds = Duration.between(session.getStartedAt(), now).getSeconds();
        int actualMinutes = (int) (elapsedSeconds / 60);

        // Anti-Cheat: Hedef süreden fazla dakika kazanılamaz
        if (actualMinutes > session.getTargetDurationMinutes()) {
            actualMinutes = session.getTargetDurationMinutes();
        }

        // Ödül Formülasyonu:
        // Oturum başarıyla tamamlandıysa tam ödül verilir.
        // Erken sonlandırmada sadece gerçek çalışılan süre (en az 5 dakika ise) oranlanarak verilir.
        long earned = 0L;
        boolean completed = !isEarlyStop && (actualMinutes >= session.getTargetDurationMinutes());

        if (completed) {
            actualMinutes = session.getTargetDurationMinutes();
            earned = Math.round(actualMinutes * COIN_PER_MINUTE);
        } else if (actualMinutes >= 5) { // Erken çıkışta 5 dakikadan az ise ödül verilmez
            earned = (long) Math.floor(actualMinutes * COIN_PER_MINUTE);
        }

        session.setActualDurationMinutes(actualMinutes);
        session.setEarnedCoins(earned);
        session.setIsCompleted(true);
        session.setEndedAt(now);
        studySessionRepository.save(session);

        if (earned > 0) {
            user.setCoinBalance(user.getCoinBalance() + earned);
            userRepository.save(user);
        }

        return mapToResponse(session, user.getCoinBalance());
    }

    @Transactional(readOnly = true)
    public StudySessionResponse getActiveSession(Long userId) {
        return studySessionRepository.findByUserIdAndIsCompletedFalse(userId)
                .map(s -> mapToResponse(s, s.getUser().getCoinBalance()))
                .orElse(null);
    }

    private StudySessionResponse mapToResponse(StudySession s, Long balance) {
        return StudySessionResponse.builder()
                .sessionId(s.getId())
                .targetDurationMinutes(s.getTargetDurationMinutes())
                .actualDurationMinutes(s.getActualDurationMinutes())
                .earnedCoins(s.getEarnedCoins())
                .isCompleted(s.getIsCompleted())
                .startedAt(s.getStartedAt())
                .endedAt(s.getEndedAt())
                .currentCoinBalance(balance)
                .build();
    }
}