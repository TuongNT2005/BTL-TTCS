package com.example.shop.dto.projection_interface;

import java.util.Set;

import com.example.shop.enums.Category;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;

public interface ProductWithVariantsAndComments {
    Integer getId();
    String getName();
    String getImage();
    Category getCategory();
    String getDescription();

    Set<CommentWithUser> getComments();
    Set<Variant> getProductVariants();

    interface Variant {
        Size getSize();
        Color getColor();
        Long getPurchasePrice();
        Long getImportCost();
        ProductVariantStatus getStatus();
        Product getProduct();

        default String getName() {
            String productName = getProduct() != null ? getProduct().getName() : "";
            String colorName = getColor() != null ? getColor().getName() : "";
            String sizeName = getSize() != null ? getSize().toString() : ""; 
            return productName + " " + colorName + " " + sizeName;
        }
    }

    interface Color {
        String getName();
    }

    interface Product {
        String getName();
    }
}