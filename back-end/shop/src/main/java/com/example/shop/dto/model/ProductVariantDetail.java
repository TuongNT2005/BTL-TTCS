package com.example.shop.dto.model;

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
public class ProductVariantDetail {

    private Integer id;
    private Integer productId;
    private String color;
    private String size;
    private Long importCost;
    private Long purchasePrice;
    private String status;
    private Integer quantity;
    private String image;

    
}
