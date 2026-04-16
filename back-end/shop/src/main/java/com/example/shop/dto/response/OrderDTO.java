package com.example.shop.dto.response;

import java.util.List;

import com.example.shop.entity.Order;
import com.example.shop.entity.User;

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
public class OrderDTO {
    private UserDTO user;
    private Order order;
    private List<OrderItemDTO> orderItems;
    private Long price;
}
