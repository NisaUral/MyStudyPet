package com.studyquest.dto.response;

import com.studyquest.dto.request.PlacedFurnitureDto;
import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailResponse {
    private Long roomId;
    private String roomCode;
    private String ownerUsername;
    private String wallpaperId;
    private String floorId;
    private boolean isOwner;
    private List<PlacedFurnitureDto> furnitures;
}