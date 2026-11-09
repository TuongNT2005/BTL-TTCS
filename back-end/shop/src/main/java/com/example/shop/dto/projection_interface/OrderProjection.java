package com.example.shop.dto.projection_interface;

import java.time.LocalDateTime;

import com.example.shop.enums.OrderStatus;

public interface OrderProjection {
    Integer getId();
    String getName();
    String getAddress();
    String getPhone();
    LocalDateTime getCreatedAt();
    OrderStatus getStatus();
}
