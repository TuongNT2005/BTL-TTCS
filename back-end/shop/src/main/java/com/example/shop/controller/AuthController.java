package com.example.shop.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateUserRequest;
import com.example.shop.dto.request.LoginRequest;
import com.example.shop.dto.response.CreateUserResponse;
import com.example.shop.dto.response.LoginResponse;
import com.example.shop.exception.NotFoundException;
import com.example.shop.service.AuthService;
import com.example.shop.service.UserService;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;


    @PostMapping("/registration")
    public ResponseEntity<?> registration(CreateUserRequest request) {
        try {
            CreateUserResponse response = userService.createUser(request);
            return ResponseEntity.ok(new ApiResponse<CreateUserResponse>(200, "Tạo user thành công", response));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/auth/refresh")
                .maxAge(60 * 60 * 24)
                .sameSite("None")
                .secure(true)
                .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(new ApiResponse<LoginResponse>(200, "Đăng nhập thành công", response));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new NotFoundException("Thông tin đăng nhập không hợp lệ!");
        }
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader("Authorization") String token) throws ParseException {
        System.out.println(token);
        String jwtToken = token.substring(7);
        authService.logout(jwtToken);
    }
    
    @GetMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        System.out.println(refreshToken);
        String newAccessToken = authService.renewAccessToken(refreshToken);
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(200)
            .message("Làm mới accesstoken thành công!")
            .data(newAccessToken)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
