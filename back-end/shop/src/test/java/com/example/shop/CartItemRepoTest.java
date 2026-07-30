package com.example.shop;

import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.entity.CartItem;
import com.example.shop.repository.CartItemRepository;

@Component
@SpringBootTest
public class CartItemRepoTest {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Test
    @Transactional
    void testFindAll() {
        List<CartItem>  cartItems = cartItemRepository.findAll();
        for(CartItem cartItem : cartItems) {
            System.out.println(cartItem.getUser());
        }
    }

    @Test
    @Transactional
    void testFindAllByUserId() {
        Page<CartItem>  cartItems = cartItemRepository.findAllByUserId(2, PageRequest.of(0, 10));
        Iterator<CartItem> iter = cartItems.iterator();
        while(iter.hasNext()) {
            System.out.println("==================================");
            System.out.println(iter.next());
        }
    }
}
