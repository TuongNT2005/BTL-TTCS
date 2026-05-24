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
import com.example.shop.mapper.UserMapper;
import com.example.shop.repository.UserRepository;
import com.example.shop.util.RedisConnection;
import com.nimbusds.jwt.SignedJWT;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    public LoginResponse login(LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                loginRequest.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);

        // Lưu thông tin vào securrityContext để sử dụng trong toan dự án
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo các token
        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toUserDTO(user))
                .build();
    }

    public void logout(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Long remainingJwtTokenTime = (expirationTime.getTime() - (new Date().getTime())) / 1000;
        System.out.println(remainingJwtTokenTime);
        if (remainingJwtTokenTime > 0) {
            String key = (String) signedJWT.getJWTClaimsSet().getJWTID();
            Long val = (Long) signedJWT.getJWTClaimsSet().getClaim("userId");
            RedisConnection.saveToRedis(key, String.valueOf(val), remainingJwtTokenTime);
        }
    }

    public String renewAccessToken(String refreshToken) {
        try {
            System.out.println(refreshToken);
            if(refreshToken == null || !jwtService.verifyToken(refreshToken)) {
                throw new RuntimeException("RefreshToken không hợp lệ!");
            }

            SignedJWT signedJWT = SignedJWT.parse(refreshToken);
            Integer userId = signedJWT.getJWTClaimsSet().getIntegerClaim("userId");
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
            String newAccessToken = jwtService.generateAccessToken(user);

            System.out.println("AccessToẹn Mới: " + newAccessToken);

            return newAccessToken;
            
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public Integer getAuthenticatedUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Jwt jwt = (Jwt) authentication.getPrincipal();
            Long userId = jwt.getClaim("userId");
            return userId.intValue();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public User getAuthenticatedUser() {
        Integer userId = getAuthenticatedUserId();
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User không tồn tại!"));
    }

}
