package com.example.shop.dto.projection_interface;

import java.time.LocalDateTime;

import com.example.shop.enums.OrderStatus;
import com.example.shop.enums.Returned;
import com.example.shop.enums.Size;

public interface BoughtItemProjection {
    Integer getId();
    Integer getQuantity();
    Long getPrice();
    Integer getDiscount();
    Returned getReturned();

    Variant getProductVariant();
    OrderInfo getOrder();

    interface Variant {
        Integer getId();
        Size getSize();
        String getImage();
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
        Integer getId();
        String getName();
    }

    interface Product {
        Integer getId();
        String getName();
        String getImage();
    }

    interface OrderInfo {
        Integer getId();
        LocalDateTime getCreatedAt();
        LocalDateTime getPaidAt();
        OrderStatus getStatus();
    }
}

