package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.ChangePasswordRequest;
import com.example.shop.dto.request.UpdateUserInforRequest;
import com.example.shop.dto.response.UserDTO;
import com.example.shop.entity.User;
import com.example.shop.mapper.UserMapper;
import com.example.shop.service.AuthService;
import com.example.shop.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;


@Controller
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/search")
    public ResponseEntity<?> searchUser(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page") Integer page) {
        Page<User> users = userService.searchlUser(page - 1, keyword);
        Page<UserDTO> data = users.map(user -> userMapper.toUserDTO(user));

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
                .data(userMapper.toUserDTO(user))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("update-infor/{id}")
    public ResponseEntity<?> updateInfor(@PathVariable(name = "id") Integer id, UpdateUserInforRequest request) {
        User authUser = authService.getAuthenticatedUser();
        if(authUser.getId() != id) {
            throw new RuntimeException("Không thể tự ý thay đổi thông tin của người khác!");
        }
        User user = userService.updateUserInfor(request, id);

        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
            .code(200)
            .message("Thao tác thành công!")
            .data(userMapper.toUserDTO(user))
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("change-pass/{id}")
    public ResponseEntity<?> changePassword(@PathVariable(name = "id") Integer id, ChangePasswordRequest request) {
        User authUser = authService.getAuthenticatedUser();
        if(authUser.getId() != id) {
            throw new RuntimeException("Không thể tự ý thay đổi mật khẩu của người khác!");
        }
        userService.changePassword(request, id);

        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(200)
            .message("Thao tác thành công!")
            .data("")
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }
}
