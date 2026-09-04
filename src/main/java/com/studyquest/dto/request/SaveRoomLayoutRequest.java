package com.studyquest.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SaveRoomLayoutRequest {
    private String wallpaperId;
    private String floorId;

    @NotNull(message = "Mobilya listesi boş olamaz")
    @Valid
    private List<PlacedFurnitureDto> furnitures;
}