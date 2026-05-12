package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CancelOrderRequest;
import com.example.shop.dto.request.CreateNewOrderRequest;
import com.example.shop.dto.request.UpdateOrderInforRequest;
import com.example.shop.dto.response.CancelOrderResponse;
import com.example.shop.dto.response.CreateNewOrderResponse;
import com.example.shop.dto.response.OrderDTO;
import com.example.shop.dto.response.OrderItemDTO;
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
    public ResponseEntity<?> createNewOrder(CreateNewOrderRequest request) {
        
        User user = authService.getAuthenticatedUser();
        Order newOrder = orderService.createNewOrder(request.getCartItemIds(), request.getQuantities(), user);
        
        ApiResponse<CreateNewOrderResponse> response = ApiResponse.<CreateNewOrderResponse>builder()
            .code(200)
            .message("Tạo đơn hàng thành công!")
            .data(Converter.parseOrderToCreateNewOrderResponse(newOrder))
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateOrderInfor(UpdateOrderInforRequest request) {
        User user = authService.getAuthenticatedUser();
        Order order = orderService.updateOrderInfor(request, user);

        ApiResponse<OrderDTO> response = ApiResponse.<OrderDTO>builder()
            .code(200)
            .message("Cập nhập đơn hàng thành công!")
            .data(orderService.convertToOrderDTO(order))
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    

    @PutMapping("/cancel")
    public ResponseEntity<?> cancelOrder(CancelOrderRequest request) {
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
    public ResponseEntity<?> searchOrderByStatus( @RequestParam(value = "page") Integer page,
                                    @RequestParam(value = "status") String status) {

        Page<OrderDTO> data = orderService.findOrderByStatus(status, page-1);
        ApiResponse<Page<OrderDTO>> response = ApiResponse.<Page<OrderDTO>>builder()
                                        .code(200)
                                        .message("Lấy dữ liệu thành công!")
                                        .data(data)
                                        .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @PutMapping("/set-sending/{orderId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> comfirmSendingOrder(@PathVariable(name = "orderId") Integer orderid) {
        Order order = orderService.comfirmSendingOrder(orderid);
        
        ApiResponse<Order> response = ApiResponse.<Order>builder()
            .code(200)
            .message("Cập nhập thành công!")
            .data(order)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/get-all/{userId}")
    public ResponseEntity<?> getAllUserOrder(@RequestParam(name = "page") Integer page) {

        User user = authService.getAuthenticatedUser();
        Page<OrderDTO> orders = orderService.findAllOrdersByUser(user, page - 1);

        ApiResponse<Page<OrderDTO>> response = ApiResponse.<Page<OrderDTO>>builder()
            .code(200)
            .message("Lấy danh sách các đơn hàng thành công!")
            .data(orders)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/bought-items")
    public ResponseEntity<?> getMethodName(@RequestParam(name = "page") Integer page) {
        User user = authService.getAuthenticatedUser();
        System.out.println(user.getUsername());
        Page<OrderItemDTO> orderItemDTOs = orderService.findAllBoughtItemByUserId(user.getId(), page-1);

        ApiResponse<Page<OrderItemDTO>> response = ApiResponse.<Page<OrderItemDTO>>builder()
            .code(200)
            .message("Lấy danh sách các sản phẩm đã mua thành công!")
            .data(orderItemDTOs)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}   
