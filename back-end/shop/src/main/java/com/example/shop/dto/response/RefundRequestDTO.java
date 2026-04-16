package com.example.shop.dto.response;

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
public class RefundRequestDTO {
    private String username;
    private String productName;
    private String createdAt;
    private String status;
    private String image;
    private Integer id;
    private String reason;
}
