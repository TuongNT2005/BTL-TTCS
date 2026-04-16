package com.example.shop.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateUserRequest;
import com.example.shop.dto.response.CreateUserResponse;
import com.example.shop.entity.User;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.UserRepository;
import com.example.shop.util.ConstantVal;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(String.format("User với id=%d không tồn tại!", userId)));
    }

    public CreateUserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException(
                    String.format("User with username: %s had already existed", request.getUsername()));
        }

        try {

            User user = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(User.UserEnum.USER)
                    .address("123")
                    .avatar("aaa")
                    .coin(0l)
                    .email("useremail" + System.currentTimeMillis() + "@gmail.com")
                    .phone("0000000")
                    .status(User.UserEnum.ACTIVE)
                    .build();
            userRepository.save(user);

            return CreateUserResponse.builder().username(user.getUsername()).build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }

    public Page<User> searchlUser(Integer pageNumber, String keyword) {
        return userRepository.searchUser(PageRequest.of(pageNumber, ConstantVal.itemPerPage), keyword);
    }

    public User findUserByUserId(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException(String.format("Người dùng với id=%d không tồn tại!", userId)));
    }
    
}
