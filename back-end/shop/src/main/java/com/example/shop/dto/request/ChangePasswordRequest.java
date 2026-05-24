package com.example.shop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePasswordRequest {
    private String oldPass;
    private String newPass;
    private String comfirmPass;
}
