package com.studyquest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private Long coinBalance;
    private boolean hasSelectedPet;
    private boolean hasRoom;        // Kullanıcının kendi odası var mı?
    private String roomCode;        // Varsa oda kodu
}