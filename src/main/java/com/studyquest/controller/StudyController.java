package com.studyquest.controller;

import com.studyquest.dto.request.StartStudyRequest;
import com.studyquest.dto.response.StudySessionResponse;
import com.studyquest.entity.User;
import com.studyquest.service.StudyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.studyquest.dto.StudyCompletionRewardDTO;
import com.studyquest.service.StreakAndRewardService;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudyController {

    private final StudyService studyService;
    private final StreakAndRewardService streakAndRewardService;
    // POST /api/study/start -> Çalışma seansını sunucuda başlat
    @PostMapping("/start")
    public ResponseEntity<StudySessionResponse> startStudy(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StartStudyRequest request) {
        return ResponseEntity.ok(studyService.startSession(user.getId(), request));
    }

    // POST /api/study/complete -> Hedef süre dolduğunda oturumu başarıyla bitir
    @PostMapping("/complete")
    public ResponseEntity<StudySessionResponse> completeStudy(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyService.endSession(user.getId(), false));
    }

    // POST /api/study/cancel -> Erken sonlandır (kısmi ödül kontrolüyle)
    @PostMapping("/cancel")
    public ResponseEntity<StudySessionResponse> cancelStudy(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyService.endSession(user.getId(), true));
    }

    // GET /api/study/active -> Uygulama açılışında yarım kalan aktif seans kontrolü
    @GetMapping("/active")
    public ResponseEntity<StudySessionResponse> getActiveSession(@AuthenticationPrincipal User user) {
        StudySessionResponse response = studyService.getActiveSession(user.getId());
        return ResponseEntity.ok(response);
    }
    @PostMapping("/sessions/complete")
public ResponseEntity<StudyCompletionRewardDTO> completeSession(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestParam int durationMinutes
) {
    return ResponseEntity.ok(streakAndRewardService.processSessionCompletion(userDetails.getUsername(), durationMinutes));
}
}