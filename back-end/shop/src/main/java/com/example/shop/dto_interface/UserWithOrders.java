package com.example.shop.dto_interface;

import java.util.Set;

import com.example.shop.entity.Order;

public interface UserWithOrders {
    String getUsrname();
    String getEmail();
    Set<Order> getOrders();
}
