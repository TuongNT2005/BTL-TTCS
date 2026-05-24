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
public class ProductDetailDTO {

    private Integer id;
    private String name;
    private String description;
    private String image;
    private String category;
}
