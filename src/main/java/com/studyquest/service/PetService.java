package com.studyquest.service;

import com.studyquest.dto.request.CreatePetRequest;
import com.studyquest.dto.request.UpdatePetAccessoriesRequest;
import com.studyquest.dto.response.PetResponse;
import com.studyquest.entity.Pet;
import com.studyquest.entity.User;
import com.studyquest.repository.PetRepository;
import com.studyquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    // Kullanıcının ilk evcil hayvanını oluşturması
    @Transactional
    public PetResponse createPet(Long userId, CreatePetRequest request) {
        if (petRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Kullanıcının zaten seçili bir evcil hayvanı bulunmaktadır.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        Pet pet = Pet.builder()
                .name(request.getName().trim())
                .type(request.getType())
                .equippedHat(request.getEquippedHat())
                .equippedGlasses(request.getEquippedGlasses())
                .equippedAccessory(request.getEquippedAccessory())
                .user(user)
                .build();

        pet = petRepository.save(pet);
        return mapToResponse(pet);
    }

    // Kullanıcının mevcut evcil hayvanını getirme
    @Transactional(readOnly = true)
    public PetResponse getMyPet(Long userId) {
        Pet pet = petRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Henüz bir evcil hayvan seçmediniz."));
        return mapToResponse(pet);
    }

    // Aksesuarları güncelleme (Kullanıcı dolabından eşya değiştirdiğinde)
    @Transactional
    public PetResponse updateAccessories(Long userId, UpdatePetAccessoriesRequest request) {
        Pet pet = petRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı."));

        pet.setEquippedHat(request.getEquippedHat());
        pet.setEquippedGlasses(request.getEquippedGlasses());
        pet.setEquippedAccessory(request.getEquippedAccessory());

        pet = petRepository.save(pet);
        return mapToResponse(pet);
    }

    // Başka bir kullanıcının pet bilgisini sorgulama (Oda içi tıklamalarda kullanılacak)
    @Transactional(readOnly = true)
    public PetResponse getPetByUserId(Long targetUserId) {
        Pet pet = petRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new RuntimeException("İlgili kullanıcıya ait evcil hayvan bulunamadı."));
        return mapToResponse(pet);
    }

    private PetResponse mapToResponse(Pet pet) {
        return PetResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .type(pet.getType())
                .equippedHat(pet.getEquippedHat())
                .equippedGlasses(pet.getEquippedGlasses())
                .equippedAccessory(pet.getEquippedAccessory())
                .ownerUsername(pet.getUser().getUsername())
                .build();
    }
}