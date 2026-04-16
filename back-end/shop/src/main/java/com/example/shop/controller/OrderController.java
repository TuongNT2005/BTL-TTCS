package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CancelOrderRequest;
import com.example.shop.dto.request.CreateNewOrderRequest;
import com.example.shop.dto.response.CancelOrderResponse;
import com.example.shop.dto.response.CreateNewOrderResponse;
import com.example.shop.dto.response.OrderDTO;
import com.example.shop.entity.Order;
import com.example.shop.entity.User;
import com.example.shop.service.AuthService;
import com.example.shop.service.ColorService;
import com.example.shop.service.OrderService;
import com.example.shop.service.ProductService;
import com.example.shop.service.UserService;
import com.example.shop.util.Converter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired OrderService orderService;
    @Autowired AuthService authService;
    @Autowired UserService userService;
    @Autowired ProductService productService;
    @Autowired ColorService colorService;

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

    @GetMapping("/detail/{orderId}")
    public ResponseEntity<?> getOrderDetail(@PathVariable(value = "orderId") Integer orderId) {
        
        OrderDTO data = orderService.getOrderDTObyOrderId(orderId);

        ApiResponse<OrderDTO> response = ApiResponse.<OrderDTO>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(data)
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> getOrderByStatus( @RequestParam(value = "page") Integer page,
                                    @RequestParam(value = "status") String status) {

        Page<OrderDTO> data = orderService.findOrderByStatus(status, page-1);
        ApiResponse<Page<OrderDTO>> response = ApiResponse.<Page<OrderDTO>>builder()
                                        .code(200)
                                        .message("Lấy dữ liệu thành công!")
                                        .data(data)
                                        .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @PutMapping("sending/{orderId}")
    public ResponseEntity<?> comfirmSendingOrder(@PathVariable(name = "orderId") Integer orderid) {
        Order order = orderService.comfirmSendingOrder(orderid);
        
        ApiResponse<Order> response = ApiResponse.<Order>builder()
            .code(200)
            .message("Cập nhập thành công!")
            .data(order)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}   
