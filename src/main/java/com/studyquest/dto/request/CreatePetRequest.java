package com.studyquest.dto.request;

import com.studyquest.entity.enums.PetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePetRequest {

    @NotNull(message = "Evcil hayvan türü seçilmelidir")
    private PetType type;

    @NotBlank(message = "Evcil hayvana bir isim vermelisiniz")
    @Size(min = 2, max = 25, message = "İsim 2-25 karakter arasında olmalıdır")
    private String name;

    // İlk seçimde opsiyonel gelebilecek varsayılan aksesuarlar
    private String equippedHat;
    private String equippedGlasses;
    private String equippedAccessory;
}