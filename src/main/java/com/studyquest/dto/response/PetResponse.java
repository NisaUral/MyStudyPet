package com.studyquest.dto.response;

import com.studyquest.entity.enums.PetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetResponse {
    private Long id;
    private String name;
    private PetType type;
    private String equippedHat;
    private String equippedGlasses;
    private String equippedAccessory;
    private String ownerUsername;
}