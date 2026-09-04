package com.studyquest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacedFurnitureDto {
    @NotBlank(message = "Eşya katalog kodu zorunludur")
    private String itemId;

    @NotNull(message = "Grid X koordinatı zorunludur")
    private Integer gridX;

    @NotNull(message = "Grid Y koordinatı zorunludur")
    private Integer gridY;

    @NotNull(message = "Dönüş açısı zorunludur")
    private Integer rotation;
}