package com.example.shop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ImportProductVariantRequest {
    private Integer productId;
    private String size;
    private String color;
    private Integer quantity;
    private Long importCost;
}
