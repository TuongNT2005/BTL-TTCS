package com.example.shop.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.example.shop.dto.response.AddToCartResponse;
import com.example.shop.dto.response.CancelOrderResponse;
import com.example.shop.dto.response.CreateNewOrderResponse;
import com.example.shop.dto.response.EventDTO;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Event;
import com.example.shop.entity.Order;



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
        if(date == null || date.equals("")) return null;
        return LocalDate.parse(date,DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        DateTimeFormatter pattern = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dateTime.format(pattern);
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

    public static EventDTO convertEventToEventDTO(Event event) {
        return EventDTO.builder()
            .id(event.getId())
            .title(event.getTitle())
            .discount(event.getDiscount())
            .startAt(event.getStartAt())
            .endAt(event.getEndAt())
            .description(event.getDescription())
            .image(event.getImage())
            .build();
    }


}
