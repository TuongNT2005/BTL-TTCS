package com.example.shop.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.shop.dto.response.CartItemDTO;
import com.example.shop.dto.response.ProductVariantDTO;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.ProductVariant;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.util.ConstantVal;

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

    public CartItem updateQuantity(CartItem cartItem, Integer quantity) {
        try {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return cartItem;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }


    public CartItem addToCart(Integer userId, Integer productVariantId) {

        productService.findProductVariantById(productVariantId);
        productService.checkProductVariantStatus(productVariantId);

        try {
            Optional<CartItem> tmp = cartItemRepository.findByUserIdAndProductVariantId(userId, productVariantId);
            if (tmp.isPresent()) {
                throw new RuntimeException("Biến thể đã tồn tại trong giỏ hàng!");
            } else {
                CartItem cartItem = CartItem.builder()
                        .userId(userId)
                        .productVariantId(productVariantId)
                        .quantity(1)
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
        try {
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
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public CartItem deleteCartItem(CartItem cartItem) {
        try {
            cartItemRepository.delete(cartItem);
            return cartItem;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public CartItemDTO convertToCariItemDTO(CartItem cartItem) {
        try {
            
            ProductVariant productVariant = productService.findProductVariantById(cartItem.getProductVariantId());
            ProductVariantDTO productVariantDTO = productService.convertToProductVariantDTO(productVariant);
            return CartItemDTO.builder()
                .cartItem(cartItem)
                .productVariantDTO(productVariantDTO)
                .build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Page<CartItemDTO> findAllCartItemByUserId(Integer userId, Integer page) {
        try {
            Page<CartItem> cartItems = cartItemRepository.findAllByUserId(userId, PageRequest.of(page, ConstantVal.itemPerPage));
            Page<CartItemDTO> cartItemDTOs = cartItems.map((item) -> convertToCariItemDTO(item));
            return cartItemDTOs;
        } catch (Exception e) {
             System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
