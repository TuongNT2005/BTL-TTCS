package com.example.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.entity.User;
import com.example.shop.repository.UserRepository;

import org.springframework.web.bind.annotation.GetMapping;




@Controller

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/all")
    public ResponseEntity<?> getMethodName() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<List<User>>(200, "Thành công", users));
    }
    
    @GetMapping("/auth/test")
    public ResponseEntity<?> getMethodName21() {
        String msg = "Hello world";
        return ResponseEntity.ok(msg);
    }
    
}
