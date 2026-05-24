package com.example.shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.ChangePasswordRequest;
import com.example.shop.dto.request.CreateUserRequest;
import com.example.shop.dto.request.UpdateUserInforRequest;
import com.example.shop.dto.response.CreateUserResponse;
import com.example.shop.entity.User;
import com.example.shop.enums.UserEnum;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.UserRepository;
import com.example.shop.util.ConstantVal;
import com.example.shop.util.FileUtil;

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
                    .role(UserEnum.USER)
                    .address("123")
                    .avatar("aaa")
                    .coin(0l)
                    .email("useremail" + System.currentTimeMillis() + "@gmail.com")
                    .phone("0000000")
                    .status(UserEnum.ACTIVE)
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

    public User saveUser(User user) {
        try {
            userRepository.save(user);
            return user;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public User updateUserInfor(UpdateUserInforRequest request, Integer id) {

        if (request.getEmail() == null || request.getEmail().trim().equals("") ||
                request.getPhone() == null || request.getPhone().trim().equals("") ||
                request.getAddress() == null || request.getAddress().trim().equals("")) {
            throw new ActionUnavalibleException("Hãy điền đủ thông tin!");
        }

        User user = findUserById(id);

        try {
            if (FileUtil.isFilePresent(request.getAvatar())) {
                FileUtil.deleteFile(user.getAvatar());
                String newFileName = FileUtil.saveFileToDir(request.getAvatar(), "user", FileUtil.genFileName("user_"));
                user.setAvatar(newFileName);
            }
            user.setAddress(request.getAddress());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());

            return saveUser(user);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public User changePassword(ChangePasswordRequest request, Integer id) {

        if( request.getOldPass() == null || request.getOldPass().trim().equals("") ||
            request.getNewPass() == null || request.getNewPass().trim().equals("") ||
            request.getComfirmPass() == null || request.getComfirmPass().trim().equals("")) {
                throw new ActionUnavalibleException("Hãy điền đủ thông tin!");
        }
        
        User user = findUserById(id);

        if(!passwordEncoder.matches(request.getOldPass(), user.getPassword())) {
            System.out.println(user.getPassword());
            System.out.println(passwordEncoder.encode(request.getOldPass()));

            throw new ActionUnavalibleException("Mật khẩu sai!");
        }

        if(request.getOldPass().equals(request.getNewPass())) {
            throw new ActionUnavalibleException("Mật cũ không được trùng với mật khẩu mới");
        }

        if(!request.getComfirmPass().equals(request.getNewPass())) {
            throw new ActionUnavalibleException("Mật khẩu mới và mật khẩu xác nhận không khớp nhau!");
        }

        try {
            user.setPassword(passwordEncoder.encode(request.getNewPass()));
            return saveUser(user);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

}
