package com.example.shop.mapper;

import org.springframework.stereotype.Component;

import com.example.shop.dto.response.UserDTO;
import com.example.shop.entity.User;

@Component
public class UserMapper {
    public UserDTO toUserDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())           
            .username(user.getUsername())
            .email(user.getEmail())
            .phone(user.getPhone())
            .address(user.getAddress())
            .coin(user.getCoin())
            .status(user.getStatus().toString())
            .role(user.getRole().toString())
            .avatar(user.getAvatar())
            .build();
    }
}
