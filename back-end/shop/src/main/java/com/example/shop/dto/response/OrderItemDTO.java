package com.example.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Integer id;
    private Integer orderId;
    private String productVariantName;
    private String image;
    private Integer quantity;
    private Long price;
    private Integer discount;
}
