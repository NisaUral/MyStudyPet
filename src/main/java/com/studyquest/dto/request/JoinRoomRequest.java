package com.studyquest.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomRequest {
    @NotBlank(message = "Oda kodu boş bırakılamaz")
    private String roomCode;
}