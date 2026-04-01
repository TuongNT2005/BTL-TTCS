package com.example.shop.service;

import java.text.ParseException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.LoginRequest;
import com.example.shop.dto.response.LoginResponse;
import com.example.shop.entity.User;
import com.example.shop.util.RedisConnection;
import com.nimbusds.jwt.SignedJWT;

@Service
public class AuthService{

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;
    @Autowired private UserService userService;

    public LoginResponse login(LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken token = 
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);

        // Lưu thông tin vào securrityContext để sử dụng trong toan dự án
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Tạo các token
        String accessToken = jwtService.generateAccessToken((User) authentication.getPrincipal());
        String refreshToken = jwtService.generateRefreshToken((User) authentication.getPrincipal());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void logout(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Long remainingJwtTokenTime = (expirationTime.getTime() - (new Date().getTime()))/1000;
        System.out.println(remainingJwtTokenTime);
        if(remainingJwtTokenTime > 0) {
            String key = (String) signedJWT.getJWTClaimsSet().getJWTID();
            Long val = (Long) signedJWT.getJWTClaimsSet().getClaim("userId");
            RedisConnection.saveToRedis(key, String.valueOf(val), remainingJwtTokenTime);
        }
    }

    public Integer getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
        Jwt jwt = (Jwt) authentication.getPrincipal();
        // jwt.getClaim("userId") trả về Long
        Long userId = jwt.getClaim("userId");
        return userId.intValue();
    }

    public User getAuthenticatedUser() {
        Integer userId = getAuthenticatedUserId();
        return userService.findUserById(userId);
    }

}
