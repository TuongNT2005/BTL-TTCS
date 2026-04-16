package com.example.shop.dto.model;

import com.example.shop.entity.ProductVariant;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductVariantDetail {

    private Integer id;
    private Long importCost;
    private Long purchasePrice;
    private String status;
    private Integer quantity;
    private String image;
    private String size;
    private String name;
    private String color;

    public ProductVariantDetail(ProductVariant productVariant, String name, String color) {
        this.id = productVariant.getId();
        this.importCost = productVariant.getImportCost();
        this.purchasePrice = productVariant.getPurchasePrice();
        this.status = productVariant.getStatus().toString();
        this.quantity = productVariant.getQuantity();
        this.image = productVariant.getImage();
        this.size = productVariant.getSize().toString();
        this.name = name;
        this.color = color;
    }

}
