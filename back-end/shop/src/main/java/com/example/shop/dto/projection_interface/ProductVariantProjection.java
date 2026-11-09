package com.example.shop.dto.projection_interface;

import com.example.shop.enums.Category;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;

public interface ProductVariantProjection {
    Integer getId();
    Size getSize();
    Long getImportCost();
    Long getPurchasePrice();
    ProductVariantStatus getStatus();
    Integer getQuantity();
    String getImage();

    Product getProduct();
    Color getColor();

    default String getName() {
        String productName = getProduct() != null ? getProduct().getName() : "";
        String colorName = getColor() != null ? getColor().getName() : "";
        String sizeName = getSize() != null ? getSize().toString() : "";
        return productName + " " + colorName + " " + sizeName;
    }

    interface Product {
        Integer getId();
        String getName();
        Category getCategory();
        String getImage();
    }

    interface Color {
        Integer getId();
        String getName();
    }
}

