package com.example.shop.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.example.shop.dto.response.AddToCartResponse;
import com.example.shop.dto.response.CancelOrderResponse;
import com.example.shop.dto.response.CreateNewOrderResponse;
import com.example.shop.dto.response.EventDTO;
import com.example.shop.dto.response.ProductDTO;
import com.example.shop.dto.response.ProductVariantDTO;
import com.example.shop.dto.response.RefundRequestDTO;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Event;
import com.example.shop.entity.Order;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.service.ColorService;
import com.example.shop.service.EventService;


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

    public static ProductVariantDTO convertProductToProductVariantDTO(ProductVariant productVariant, Product product, ColorService colorService, EventService eventService) {
        String colorName = colorService.findColorNameById(productVariant.getColorId());
        Integer discount = eventService.findDiscounts(product.getId());
        return new ProductVariantDTO(productVariant, product.getName(), colorName, discount);
    }

    public static ProductDTO convertProductToProductDTO(Product product, List<ProductVariantDTO> productVariants) {
        return ProductDTO.builder()
            .id(product.getId())
            .name(product.getName())
            .image(product.getImage())
            .category(product.getCategory().toString())
            .productVariants(productVariants)
            .build();
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

    public static RefundRequestDTO convertRefundRequestToRefundRequestDTO(RefundRequest refundRequest, User user, Product product, String color, ProductVariant productVariant) {
        return RefundRequestDTO.builder()
            .id(refundRequest.getId())
            .username(user.getUsername())
            .productName(product.getName() + " - " + color + " - " + productVariant.getSize().toString())
            .image(refundRequest.getImage())
            .reason(refundRequest.getReason())
            .status(refundRequest.getStatus().toString())
            .createdAt(refundRequest.getCreatedAt().toString())
            .build();
    }


}
