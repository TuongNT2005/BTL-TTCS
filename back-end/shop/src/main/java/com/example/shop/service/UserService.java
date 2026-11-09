package com.example.shop.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.shop.dto.projection_interface.UserInfoWithoutPassProjection;
import com.example.shop.dto.request.ChangePasswordRequest;
import com.example.shop.dto.request.CreateNewUserRequest;
import com.example.shop.dto.request.UpdateUserInforRequest;
import com.example.shop.entity.User;
import com.example.shop.enums.UserEnum;
import com.example.shop.exception.ActionUnavailableException;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.UserRepository;
import com.example.shop.repository.specification.UserSpecification;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createNewUser(CreateNewUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ActionUnavailableException("Username: " + request.getUsername() + " đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ActionUnavailableException("Email: " + request.getEmail() + " đã được sử dụng!");
        }

        try {
            User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();

            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ActionUnavailableException("Email: " + request.getEmail() +" đã được sử dụng!");
        } 
    }

    // NHỚ Thêm passwordEncoder vô
    public void changePassword(ChangePasswordRequest request, Integer userId) {
        User user = userRepository.findUserById(userId);

        if(!user.getEmail().equals(request.getEmail())) {
            throw new ActionUnavailableException("Thông tin không khớp!");
        }

        if(!user.getPassword().equals(request.getOldPassword())) {
            throw new ActionUnavailableException("Mật khẩu cũ không khớp!");
        }

        if(user.getPassword().equals(request.getNewPassword())) {
            throw new ActionUnavailableException("Mật khẩu mới không được trùng với mật khẩu cũ!");
        }

        user.setPassword(request.getNewPassword());
        userRepository.save(user);
    }

    public Page<UserInfoWithoutPassProjection> searchUser(Pageable pageable, String keyword) {
        Specification<User> spec = Specification.where(UserSpecification.hasUsername(keyword))
                                                .and(UserSpecification.notHasRole(UserEnum.ADMIN));
        return userRepository.findBy(spec, q -> q
                .as(UserInfoWithoutPassProjection.class)
                .page(pageable)
        );
    }

    public Page<UserInfoWithoutPassProjection> searchlUser(Pageable pageable, String keyword) {
        return searchUser(pageable, keyword);
    }

    public UserInfoWithoutPassProjection updateUserInfor(UpdateUserInforRequest request, Integer userId) {
        User user = userRepository.findUserById(userId);
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        userRepository.save(user);
        return userRepository.findUserInfoWithoutPassById(userId).orElseThrow(
            () -> new NotFoundException("Người dùng không tồn tại!")
        );
    }

    public UserInfoWithoutPassProjection getUserProfile(Integer userId) {
        return userRepository.findUserInfoWithoutPassById(userId).orElseThrow(
            () -> new NotFoundException("Người dùng không tồn tại!")
        );
    }
}

