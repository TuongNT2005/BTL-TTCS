package com.example.shop.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserInforRequest {
    private  MultipartFile avatar;
    private String phone;
    private String address;
    private String email;
}
