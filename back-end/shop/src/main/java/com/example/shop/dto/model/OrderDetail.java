package com.example.shop.dto.model;

import java.util.List;

import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;

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
public class OrderDetail {
    private Order order;
    private List<OrderItem> orderItems;
    private Long price;
    private Long coinUsed;
    private Long finalPrice;
}
