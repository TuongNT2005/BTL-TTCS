package com.example.shop.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdateUserInforRequest {
    private String phone;
    private String address;
    private String avatar;

    public UpdateUserInforRequest() {
    }

    public UpdateUserInforRequest(String phone, String address, String avatar) {
        this.phone = phone;
        this.address = address;
        this.avatar = avatar;
    }
}

