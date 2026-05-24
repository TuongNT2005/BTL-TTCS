package com.example.shop.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonPropertyOrder({ "id", "image", "name", "category" })
public class ProductDTO {
    private Integer id;
    private String name;
    private String image;
    private String category;
    private List<ProductVariantDTO> productVariants;
    
    public ProductDTO(Integer id, String name, String image, String category, List<ProductVariantDTO> productVariants) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.category = category;
        this.productVariants = productVariants;
    }

    
}
