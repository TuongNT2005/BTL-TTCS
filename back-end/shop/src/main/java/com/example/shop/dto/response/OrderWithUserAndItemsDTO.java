package com.example.shop.dto.response;

import java.util.List;

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
public class OrderWithUserAndItemsDTO {
    private UserDTO user;
    private OrderDTO order;
    private List<OrderItemDTO> orderItems;
}
