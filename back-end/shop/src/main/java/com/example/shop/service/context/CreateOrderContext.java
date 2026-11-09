package com.example.shop.service.context;

import java.util.Map;
import java.util.Set;

import com.example.shop.dto.request.CreateOrderRequest;
import com.example.shop.entity.CartItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateOrderContext {
    private final CreateOrderRequest request;
    private final Integer userId;
    private final Map<Integer, Integer> quantityMap;
    private final Set<CartItem> cartItems;
    private final Map<Integer, Integer> discountMap;
    
    public CreateOrderContext(CreateOrderRequest request, Integer userId, Map<Integer, Integer> quantityMap,
            Set<CartItem> cartItems, Map<Integer, Integer> discountMap) {
        this.request = request;
        this.userId = userId;
        this.quantityMap = quantityMap;
        this.cartItems = cartItems;
        this.discountMap = discountMap;
    }

    
}
