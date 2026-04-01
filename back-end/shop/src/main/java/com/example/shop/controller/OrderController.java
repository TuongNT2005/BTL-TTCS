package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.model.OrderDetail;
import com.example.shop.dto.request.CancelOrderRequest;
import com.example.shop.dto.request.CreateNewOrderRequest;
import com.example.shop.dto.response.CancelOrderResponse;
import com.example.shop.dto.response.CreateNewOrderResponse;
import com.example.shop.dto.response.GetOrderDetailResponse;
import com.example.shop.entity.Order;
import com.example.shop.entity.User;
import com.example.shop.service.AuthService;
import com.example.shop.service.OrderService;
import com.example.shop.util.Converter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired OrderService orderService;
    @Autowired AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<?> createNewOrder(@RequestBody CreateNewOrderRequest request) {
        
        User user = authService.getAuthenticatedUser();
        Order newOrder = orderService.createNewOrder(request.getCartItemIds(), user);
        
        ApiResponse<CreateNewOrderResponse> response = ApiResponse.<CreateNewOrderResponse>builder()
            .code(200)
            .message("Tạo đơn hàng thành công!")
            .data(Converter.parseOrderToCreateNewOrderResponse(newOrder))
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelOrder(@RequestBody CancelOrderRequest request) {
        Order canceledOrder = orderService.cancelOrder(request.getOrderId());

        ApiResponse<CancelOrderResponse> response = ApiResponse.<CancelOrderResponse>builder()
            .code(200)
            .message("Huỷ đơn hàng thành công!")
            .data(Converter.parseOrderToCancelOrderResponse(canceledOrder))
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getOrderDetail(@RequestParam(name = "orderId") Integer orderId) {
        OrderDetail orderDetail = orderService.getOrderDetail(orderId);

        ApiResponse<GetOrderDetailResponse> response = ApiResponse.<GetOrderDetailResponse>builder()
            .code(200)
            .message("Lấy thông tin chi tiết đơn hàng thành công!")
            .data(new GetOrderDetailResponse(orderDetail))
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    


}   
