package com.example.shop.dto.response;

import com.example.shop.entity.CartItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDTO {
    private CartItem cartItem;
    private ProductVariantDTO productVariantDTO;
}
