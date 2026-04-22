package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.response.UserDTO;
import com.example.shop.entity.User;
import com.example.shop.service.UserService;
import com.example.shop.util.Converter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> searchUser(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page") Integer page) {
        Page<User> users = userService.searchlUser(page - 1, keyword);
        Page<UserDTO> data = users.map(user -> userService.convertToUserDTO(user));

        ApiResponse<Page<UserDTO>> response = ApiResponse.<Page<UserDTO>>builder()
                .code(200)
                .message("Lấy danh sách user thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/auth/test")
    public ResponseEntity<?> getMethodName21() {
        String msg = "Hello world";
        return ResponseEntity.ok(msg);
    }

    @GetMapping("user/{id}")
    public ResponseEntity<?> findUserById(@PathVariable(value = "id") Integer userId) {
        User user = userService.findUserById(userId);
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .code(200)
                .message("Tìm kiếm user thành công!")
                .data(userService.convertToUserDTO(user))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
