package com.example.shop.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.entity.CartItem;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.CartItemRepository;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductService productService;

    public CartItem findCartItemById(Integer id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(String.format("CartItem với id = %d không tồn tại!", id)));
    }

    public CartItem addToCart(Integer userId, Integer productVariantId, Integer quantity) {
        // Kiểm tra xem product variant có tồn tại không
        productService.findProductVariantById(productVariantId);

        // Kiểm tra xem product variant có còn đang được bán không
        productService.checkProductVariantStatus(productVariantId);

        try {
            Optional<CartItem> tmp = cartItemRepository.findByUserIdAndProductVariantId(userId, productVariantId);
            if (tmp.isPresent()) {
                CartItem existedCartItem = tmp.get();
                existedCartItem.setQuantity(existedCartItem.getQuantity() + quantity);
                cartItemRepository.save(existedCartItem);
                return existedCartItem;
            } else {
                CartItem cartItem = CartItem.builder()
                        .userId(userId)
                        .productVariantId(productVariantId)
                        .quantity(quantity)
                        .build();
                cartItemRepository.save(cartItem);
                return cartItem;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<CartItem> deleteCartItems(List<Integer> cartItemIds) {
        List<CartItem> lst = new ArrayList<>();
        for (Integer cartItemId : cartItemIds) {
            Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);
            if (cartItem.isPresent())
                lst.add(cartItem.get());
        }
        for (CartItem cartItem : lst) {
            cartItemRepository.delete(cartItem);
        }
        return lst;
    }
}
