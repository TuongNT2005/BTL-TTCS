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
public class TopSpedingUserDTO {
    private Integer id;
    private String email;
    private String image;
    private Integer boughtProducts;
    private Long totalSpending;
}
