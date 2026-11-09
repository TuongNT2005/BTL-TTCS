package com.example.shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemRequest {

    public CartItemRequest() {
    }

    public CartItemRequest(Integer cartItemId, Integer quantity) {
        this.cartItemId = cartItemId;
        this.quantity = quantity;
    }

    @NotNull(message = "Mã CartItem không được null!")
    private Integer cartItemId;

    @NotNull(message = "Số lượng mua không được null!")
    @Min(value = 1, message = "Số lượng mua phải > 0")
    private Integer quantity;
}
