package com.studyquest.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePetAccessoriesRequest {
    private String equippedHat;
    private String equippedGlasses;
    private String equippedAccessory;
}