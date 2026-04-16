package com.example.shop.dto.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.example.shop.entity.ProductVariant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({ "id", "importCost", "purchasePrice", "status", "quantity", "image", "size", "name", "color" })
public class ProductVariantDTO {
    private Integer id;
    private Long importCost;
    private Long purchasePrice;
    private String status;
    private Integer quantity;
    private String image;
    private String size;
    private String name;
    private String color;
    private Integer discount;

    public ProductVariantDTO(ProductVariant productVariant, String name, String color, Integer discount) {
        this.id = productVariant.getId();
        this.importCost = productVariant.getImportCost();
        this.purchasePrice = productVariant.getPurchasePrice();
        this.status = productVariant.getStatus().toString();
        this.quantity = productVariant.getQuantity();
        this.image = productVariant.getImage();
        this.size = productVariant.getSize().toString();
        this.name = name;
        this.color = color;
        this.discount = discount;
    }
}
