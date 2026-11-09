package com.example.shop.controller;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.request.CreateNewUserRequest;
import com.example.shop.dto.request.LoginRequest;
import com.example.shop.dto.request.RefreshTokenRequest;
import com.example.shop.dto.response.LoginResponse;
import com.example.shop.entity.User;
import com.example.shop.service.AuthService;
import com.example.shop.service.UserService;

import jakarta.validation.Valid;
@RestController
@Validated
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid CreateNewUserRequest request) {
        User user = userService.createNewUser(request);
        
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(201)
                .message("Đăng ký tài khoản thành công!")
                .data(user.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/users/" + user.getId()))
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse responseData = authService.login(request);

        ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                .code(200)
                .message("Đăng nhập thành công!")
                .data(responseData)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody(required = false) RefreshTokenRequest requestBody,
                                                @RequestParam(required = false, name = "refreshToken") String refreshTokenParam) {
        String token = (requestBody != null && requestBody.getRefreshToken() != null)
                ? requestBody.getRefreshToken()
                : refreshTokenParam;

        String newAccessToken = authService.renewAccessToken(token);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Làm mới access token thành công!")
                .data(newAccessToken)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshAccessTokenGet(@RequestParam(name = "refreshToken") String refreshToken) {
        return refreshAccessToken(null, refreshToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader.substring(7));
        }

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Đăng xuất thành công!")
                .data("")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
