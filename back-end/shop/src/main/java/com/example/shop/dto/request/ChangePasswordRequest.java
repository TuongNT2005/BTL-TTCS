package com.example.shop.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChangePasswordRequest {

    public ChangePasswordRequest() {
    }

    public ChangePasswordRequest(String email, String oldPassword, String newPassword, String confirmPassword) {
        this.email = email;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    @NotBlank(message = "Email không được bỏ trống")
    private String email;

    @NotBlank(message = "Mật khẩu không được bỏ trống!")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu không được bỏ trống!")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được bỏ trống!")
    private String confirmPassword;

    @AssertTrue(message = "Xac nhận mật khẩu không khớp!")
    public boolean isPasswordAndConfirmPasswordMatched() {
        if(newPassword == null || confirmPassword == null) {
            return false;
        }

        return newPassword.equals(confirmPassword);
    }

}
