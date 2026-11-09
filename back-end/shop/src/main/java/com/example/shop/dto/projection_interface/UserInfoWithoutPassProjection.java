package com.example.shop.dto.projection_interface;

import com.example.shop.enums.UserEnum;

public interface UserInfoWithoutPassProjection {
    Integer getId();
    String getUsername();
    String getEmail();
    String getPhone();
    String getAddress();
    String getAvatar();
    UserEnum getStatus();
    UserEnum getRole();
    Long getCoin();
}

