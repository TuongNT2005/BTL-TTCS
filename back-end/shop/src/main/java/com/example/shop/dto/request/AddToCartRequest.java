package com.example.shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRequest {

    public AddToCartRequest() {
    }

    public AddToCartRequest(Integer productVariantId, Integer quantity) {
        this.productVariantId = productVariantId;
        this.quantity = quantity;
    }

    @NotNull(message = "ProductVariant ID không được để trống!")
    private Integer productVariantId;

    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1!")
    private Integer quantity = 1;
}

