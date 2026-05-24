package com.example.shop.dto.response;


import com.example.shop.enums.OrderStatus;

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
public class OrderDTO {
    private Integer id;
    private Integer userId;
    private String address;
    private String phone;
    private String createdAt;
    private String expriredat;
    private String paidAt;
    private Long price;
    private OrderStatus status;
    private Long coinUsed;
}
