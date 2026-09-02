package com.studyquest.controller;

import com.studyquest.dto.request.CreatePetRequest;
import com.studyquest.dto.request.UpdatePetAccessoriesRequest;
import com.studyquest.dto.response.PetResponse;
import com.studyquest.entity.User;
import com.studyquest.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PetController {

    private final PetService petService;

    // POST /api/pets/create -> İlk hayvan seçimi ve isimlendirme
    @PostMapping("/create")
    public ResponseEntity<PetResponse> createPet(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePetRequest request) {
        return ResponseEntity.ok(petService.createPet(user.getId(), request));
    }

    // GET /api/pets/me -> Giriş yapan kullanıcının kendi hayvanı
    @GetMapping("/me")
    public ResponseEntity<PetResponse> getMyPet(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(petService.getMyPet(user.getId()));
    }

    // PUT /api/pets/accessories -> Şapka, gözlük veya aksesuar güncelleme
    @PutMapping("/accessories")
    public ResponseEntity<PetResponse> updateAccessories(
            @AuthenticationPrincipal User user,
            @RequestBody UpdatePetAccessoriesRequest request) {
        return ResponseEntity.ok(petService.updateAccessories(user.getId(), request));
    }

    // GET /api/pets/user/{userId} -> Odada başka bir pet'e tıklandığında sahibini ve petini çekme
    @GetMapping("/user/{userId}")
    public ResponseEntity<PetResponse> getPetByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(petService.getPetByUserId(userId));
    }
}