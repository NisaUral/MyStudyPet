package com.studyquest.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "Kullanıcı adı veya e-posta girilmelidir")
    private String usernameOrEmail;

    @NotBlank(message = "Şifre girilmelidir")
    private String password;
}