package com.example.shop.mapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.example.shop.dto.response.OrderDTO;
import com.example.shop.dto.response.OrderItemDTO;
import com.example.shop.dto.response.OrderWithUserAndItemsDTO;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.User;
import com.example.shop.service.ColorService;
import com.example.shop.service.OrderService;
import com.example.shop.service.ProductService;
import com.example.shop.service.UserService;
import com.example.shop.util.Converter;

@Component
public class OrderMapper {

    @Autowired
    @Lazy
    private UserMapper userMapper;

    @Autowired
    @Lazy
    private OrderService orderService;

    @Autowired
    @Lazy 
    private UserService userService;

    @Autowired
    @Lazy
    private ProductService productService;

    @Autowired
    @Lazy
    private ColorService colorService;

    public OrderWithUserAndItemsDTO toOrderWithUserAndItemsDTO(Order order) {

        User user = userService.findUserById(order.getUserId());
        List<OrderItem> orderItems = orderService.findOrderItemsByOrderId(order.getId());
        List<OrderItemDTO> orderItemDTOs = orderItems.stream().map(orderItem -> toOrderItemDTO(orderItem)).toList();

        return OrderWithUserAndItemsDTO.builder()
                .order(toOrderDTO(order))
                .user(userMapper.toUserDTO(user))
                .orderItems(orderItemDTOs)   
                .build();
    }

    public OrderDTO toOrderDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .address(order.getAddress())
                .phone(order.getPhone())
                .createdAt(Converter.formatDateTime(order.getCreatedAt()))
                .expriredat(Converter.formatDateTime(order.getExpriredat()))
                .paidAt(Converter.formatDateTime(order.getPaidAt()))
                .coinUsed(order.getCoinUsed())
                .status(order.getStatus())
                .price(orderService.calTotalPriceByOrderId(order.getId())) 
                .build();  
    }

    public OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        Integer orderItemId = orderItem.getId();
        Product prodcut = productService.findByOrderItemId(orderItemId);
        ProductVariant productVariant = productService.findProductVariantById(orderItem.getProductVariantId());
        String color = colorService.findColorNameById(productVariant.getColorId());

        return OrderItemDTO.builder()
                .id(orderItem.getId())
                .discount(orderItem.getDiscount())
                .image(productVariant.getImage())
                .orderId(orderItem.getOrderId())
                .price(orderItem.getPrice())
                .quantity(orderItem.getQuantity())
                .productVariantName(prodcut.getName() + " - " + color + " - " + productVariant.getSize().toString())
                .build();
    }
}
