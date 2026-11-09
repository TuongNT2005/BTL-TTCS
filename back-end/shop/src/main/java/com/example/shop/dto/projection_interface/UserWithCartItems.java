package com.example.shop.dto.projection_interface;

import java.util.Iterator;
import java.util.Set;

import com.example.shop.entity.CartItem;

public interface UserWithCartItems {
    String getUsername();
    String getEmail();
    String getAvatar();
    Set<CartItem> getCartItems();

    public default void cartItems() {
        Iterator<CartItem> iter = getCartItems().iterator();
        while(iter.hasNext()) {
            System.out.println(iter.next());
        }
    }

}   
