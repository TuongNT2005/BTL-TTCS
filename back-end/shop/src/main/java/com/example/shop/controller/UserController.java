package com.example.shop.controller;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.UserInfoWithoutPassProjection;
import com.example.shop.dto.request.ChangePasswordRequest;
import com.example.shop.dto.request.UpdateUserInforRequest;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.service.AuthService;
import com.example.shop.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping({"/users", "/user"})
public class UserController {
    
    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping({"", "/password"})
    public ResponseEntity<?> changePass(@Valid @RequestBody ChangePasswordRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        userService.changePassword(request, userId);
        
        ApiResponse<String> response = ApiResponse.<String>builder()
                                            .code(200)
                                            .message("Thao tác thành công!")
                                            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> searchUser(
            @RequestParam(required = false, name = "keyword", defaultValue = "") String keyword,
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size") Integer size,
            @RequestParam(required = false, name = "pageSize") Integer pageSize,
            @RequestParam(required = false, name = "sortBy") List<String> sortCriterias,
            @RequestParam(required = false, name = "sortDir") List<String> sortDirections) {
        
        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);
        Sort sort = SortParamExtracter.extractFromParams(sortCriterias, sortDirections);
        Page<UserInfoWithoutPassProjection> users = userService.searchUser(PageRequest.of(safePage, limit, sort), keyword);

        ApiResponse<Page<UserInfoWithoutPassProjection>> response = ApiResponse.<Page<UserInfoWithoutPassProjection>>builder()
                .code(200)
                .message("Lấy danh sách user thành công!")
                .data(users)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateUserInforRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        UserInfoWithoutPassProjection user = userService.updateUserInfor(request, userId);

        ApiResponse<UserInfoWithoutPassProjection> response = ApiResponse.<UserInfoWithoutPassProjection>builder()
                .code(200)
                .message("Cập nhật thông tin thành công!")
                .data(user)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Integer userId = authService.getAuthenticatedUserId();
        UserInfoWithoutPassProjection user = userService.getUserProfile(userId);

        ApiResponse<UserInfoWithoutPassProjection> response = ApiResponse.<UserInfoWithoutPassProjection>builder()
                .code(200)
                .message("Lấy thông tin cá nhân thành công!")
                .data(user)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

