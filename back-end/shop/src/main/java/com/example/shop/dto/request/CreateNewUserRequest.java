package com.example.shop.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNewUserRequest {

    public CreateNewUserRequest() {
    }

    public CreateNewUserRequest(String username, String email, String password, String confirmPassword) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    @NotBlank(message = "Username không được bỏ trống!")
    private String username;

    @NotBlank(message = "Email không được bỏ trống!")
    private String email;

    @NotBlank(message = "Mật khẩu không được bỏ trống!")
    private String password;

    @NotBlank(message = "Xác nhận mật khẩu không được bỏ trống!")
    private String confirmPassword;

    public void setComfirmPassword(String comfirmPassword) {
        if (this.confirmPassword == null || this.confirmPassword.isBlank()) {
            this.confirmPassword = comfirmPassword;
        }
    }

    @AssertTrue(message = "Mật khẩu không khớp!")
    public boolean isPasswordAndConfirmPasswordMatched() {
        if(password == null || confirmPassword == null) {
            return false;
        }

        return password.equals(confirmPassword);
    }
}
