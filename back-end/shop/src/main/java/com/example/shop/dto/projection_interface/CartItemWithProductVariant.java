package com.example.shop.dto.projection_interface;

import com.example.shop.entity.ProductVariant;

public interface CartItemWithProductVariant {
    Integer getId();
    Integer getQuantity();
    String getName();
}
