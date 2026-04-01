package com.example.shop.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.example.shop.dto.model.ProductVariantDetail;
import com.example.shop.dto.response.AddToCartResponse;
import com.example.shop.dto.response.CancelOrderResponse;
import com.example.shop.dto.response.CreateNewOrderResponse;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Order;
import com.example.shop.entity.ProductVariant;
import com.example.shop.service.ColorService;

public class Converter {

    public static AddToCartResponse parseCartItemToAddToCartResponse(CartItem cartItem) {
        return AddToCartResponse.builder()
                .id(cartItem.getId())
                .userId(cartItem.getUserId())
                .productVariantId(cartItem.getProductVariantId())
                .quantity(cartItem.getQuantity())
                .build();
    }

    public static CreateNewOrderResponse parseOrderToCreateNewOrderResponse(Order order) {
        return CreateNewOrderResponse.builder()
            .createdAt(order.getCreatedAt())
            .expriedAt(order.getExpriredat())
            .status(order.getStatus().toString())
            .id(order.getId())
            
            .build();
    }

    public static CancelOrderResponse parseOrderToCancelOrderResponse(Order order) {
        return CancelOrderResponse.builder()
            .id(order.getId())
            .createdAt(order.getCreatedAt())
            .expriredat(order.getExpriredat())
            .status(order.getStatus().toString())
            .build();
    }

    public static LocalDate StringToLocalDate(String date) {
        return LocalDate.parse(date,DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    public static String convertStringToCapitalizedForm(String string) {
        String[] words = string.split("\s+");
        StringBuilder res = new StringBuilder();
        res.append(words[0].substring(0, 1).toUpperCase() + words[0].substring(1).toLowerCase());
        for(int i = 1; i < words.length; i++) {
            res.append(" ");
            res.append(words[i].toLowerCase());
        }
        return res.toString();
    }

    public static long convertPriceFromDoubleToLong(Double price) {
        return (long) (price / 1000) * 1000l;
    }

}
