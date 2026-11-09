package com.example.shop.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private Integer userId;
    private String username;
    private String email;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(String accessToken, String refreshToken, Integer userId, String username, String email, String role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}

