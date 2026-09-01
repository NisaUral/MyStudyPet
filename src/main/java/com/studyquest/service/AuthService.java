package com.studyquest.service;

import com.studyquest.config.JwtService;
import com.studyquest.dto.request.LoginRequest;
import com.studyquest.dto.request.RegisterRequest;
import com.studyquest.dto.response.AuthResponse;
import com.studyquest.entity.Room;
import com.studyquest.entity.User;
import com.studyquest.repository.PetRepository;
import com.studyquest.repository.RoomRepository;
import com.studyquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PetRepository petRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanımda.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanımda.");
        }

        // 1. Yalnızca kullanıcıyı kaydet (Oda oluşturma sonraya bırakıldı)
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .coinBalance(0L)
                .build();
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .coinBalance(user.getCoinBalance())
                .hasSelectedPet(false)
                .hasRoom(false)
                .roomCode(null)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Hatalı şifre.");
        }

        String token = jwtService.generateToken(user.getUsername());
        boolean hasPet = petRepository.findByUserId(user.getId()).isPresent();
        var ownedRoom = roomRepository.findByOwnerId(user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .coinBalance(user.getCoinBalance())
                .hasSelectedPet(hasPet)
                .hasRoom(ownedRoom.isPresent())
                .roomCode(ownedRoom.map(Room::getRoomCode).orElse(null))
                .build();
    }
}