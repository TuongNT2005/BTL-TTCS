package com.example.shop.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdateVariantRequest {
    private String status;

    @Min(value = 0, message = "Giá bán không được âm")
    private Long purchasedPrice;

    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;

    public UpdateVariantRequest() {
    }

    public UpdateVariantRequest(String status, Long purchasedPrice, Integer quantity) {
        this.status = status;
        this.purchasedPrice = purchasedPrice;
        this.quantity = quantity;
    }
}

