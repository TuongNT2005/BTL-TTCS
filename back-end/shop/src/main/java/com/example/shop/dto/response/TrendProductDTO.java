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
public class TrendProductDTO {
    private Integer id;
    private String name;
    private String image;
    private Integer quantity;
    private Long income;
}
