package com.example.shop.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.example.shop.dto.response.ProductVariantDTO;
import com.example.shop.dto.response.RefundRequestDTO;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.service.ProductService;
import com.example.shop.service.UserService;
import com.example.shop.util.Converter;

@Component
public class RefundRequestMapper {

    @Autowired
    @Lazy
    private UserService userService;

    @Autowired
    @Lazy
    private ProductService productService;

    @Autowired
    private ProductMapper productMapper;

    public RefundRequestDTO toRefundRequestDTO(RefundRequest refundRequest) {
        User user = userService.findUserById(refundRequest.getUserId());
        ProductVariant productVariant = productService.findProductVariantByOrderItemId(refundRequest.getOrderItemId());
        ProductVariantDTO productVariantDTO = productMapper.toProductVariantDTO(productVariant);

        return RefundRequestDTO.builder()
                .id(refundRequest.getId())
                .username(user.getUsername())
                .productName(productVariantDTO.getName())
                .image(refundRequest.getImage())
                .reason(refundRequest.getReason())
                .status(refundRequest.getStatus().toString())
                .createdAt(Converter.formatDateTime(refundRequest.getCreatedAt()))
                .quantity(refundRequest.getQuantity())
                .build();
    }
}
