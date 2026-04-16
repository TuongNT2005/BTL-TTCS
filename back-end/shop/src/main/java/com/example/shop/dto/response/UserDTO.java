package com.example.shop.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String avatar;
    private String status;
    private Long coin;
}
