package com.example.shop.dto.projection_interface;

import java.time.LocalDateTime;

import com.example.shop.enums.RefundStatus;
import com.example.shop.enums.Size;

public interface RefundRequestProjection {
    Integer getId();
    String getReason();
    String getImage();
    Integer getQuantity();
    RefundStatus getStatus();
    LocalDateTime getCreatedAt();

    UserInfo getUser();
    OrderItemInfo getOrderItem();

    interface UserInfo {
        Integer getId();
        String getUsername();
        String getEmail();
    }

    interface OrderItemInfo {
        Integer getId();
        Long getPrice();
        Integer getDiscount();
        Integer getQuantity();
        Variant getProductVariant();
    }

    interface Variant {
        Integer getId();
        Size getSize();
        Color getColor();
        Product getProduct();

        default String getName() {
            String pName = getProduct() != null ? getProduct().getName() : "";
            String cName = getColor() != null ? getColor().getName() : "";
            String sName = getSize() != null ? getSize().toString() : "";
            return pName + " " + cName + " " + sName;
        }
    }

    interface Color {
        String getName();
    }

    interface Product {
        Integer getId();
        String getName();
        String getImage();
    }
}

