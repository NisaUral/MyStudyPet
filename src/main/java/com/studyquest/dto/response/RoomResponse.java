package com.studyquest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long roomId;
    private String roomCode;
    private String ownerUsername;
    private String wallpaperId;
    private String floorId;
    private boolean isOwner;
}