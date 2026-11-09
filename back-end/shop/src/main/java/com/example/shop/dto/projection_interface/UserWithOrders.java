package com.example.shop.dto.projection_interface;

import java.util.Iterator;
import java.util.Set;

import com.example.shop.entity.Order;

public interface UserWithOrders {
    String getUsername();
    String getEmail();
    Set<Order> getOrders();

    public default void orders() {
        Iterator<Order> iter = getOrders().iterator();
        while(iter.hasNext()) {
            System.out.println(iter.next());
        }
    }
}
