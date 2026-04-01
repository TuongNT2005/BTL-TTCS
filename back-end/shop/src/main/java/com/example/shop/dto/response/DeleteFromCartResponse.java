package com.example.shop.dto.response;

import java.util.List;

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
public class DeleteFromCartResponse {
    private List<CartItem> deletedCartItems;
}
