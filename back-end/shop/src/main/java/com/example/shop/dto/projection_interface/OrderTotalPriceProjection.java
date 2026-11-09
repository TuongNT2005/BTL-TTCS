package com.example.shop.dto.projection_interface;

import java.util.Set;

import com.example.shop.entity.OrderItem;

public interface OrderTotalPriceProjection {
    Integer getId();
    Long getCoinUsed();
    Set<OrderItem> getOrderItems();
}
