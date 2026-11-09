package com.example.shop.dto.projection_interface;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.shop.enums.OrderStatus;
import com.example.shop.enums.Size;

public interface OrderWithItems {
    Integer getId();
    String getName();
    String getAddress();
    String getPhone();
    LocalDateTime getCreatedAt();
    LocalDateTime getExpriredat();
    OrderStatus getStatus();
    Long getCoinUsed();

    Set<OrderItemWithVariant> getOrderItems();

    interface OrderItemWithVariant {
        Integer getQuantity();
        Long getPrice();
        Integer getDiscount();
        Variant getProductVariant();
    }

    interface Variant {
        Size getSize();
        Color getColor();
        Product getProduct();

        default String getName() {
            String productName = getProduct() != null ? getProduct().getName() : "";
            String colorName = getColor() != null ? getColor().getName() : "";
            String sizeName = getSize() != null ? getSize().toString() : "";

            return productName + " " + colorName + " " + sizeName; 
        }
    }

    interface Product {
        String getName();
    }

    interface Color {
        String getName();
    }
}