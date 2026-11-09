package com.example.shop.controller;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.BoughtItemProjection;
import com.example.shop.dto.projection_interface.OrderProjection;
import com.example.shop.dto.projection_interface.OrderWithItems;
import com.example.shop.dto.request.CreateOrderRequest;
import com.example.shop.dto.request.UpdateOrderInfoRequest;
import com.example.shop.entity.Order;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.service.AuthService;
import com.example.shop.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/orders", "/order"})
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping({"/{orderId}/price", "/price/{orderId}"})
    public ResponseEntity<?> getPrice(@PathVariable(name = "orderId") Integer orderId) {
        Long res = orderService.calTotalPriceByOrderId(orderId);
        ApiResponse<Long> response = ApiResponse.<Long>builder()
                .code(200)
                .message("Lấy giá đơn hàng thành công!")
                .data(res)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping({"", "/"})
    public ResponseEntity<?> createNewOrder(@Valid @RequestBody CreateOrderRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        Order createdOrder = orderService.cordinateOrderCreation(request, userId);
        
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
            .code(201)
            .message("Tạo đơn hàng thành công!")
            .data(createdOrder.getId())
            .build();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/orders/" + createdOrder.getId()))
                .body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping({"/{orderId}/detail", "/{orderId}"})
    public ResponseEntity<?> updateOrderInfo(@PathVariable(name = "orderId") Integer orderId,
                                             @Valid @RequestBody UpdateOrderInfoRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        orderService.updateOrderInfor(request, orderId, userId);
        
        ApiResponse<String> response = ApiResponse.<String>builder()
                                            .code(200)
                                            .message("Thao tác thành công!")
                                            .data("")
                                            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping({"/{orderId}/cancel", "/cancel/{orderId}"})
    public ResponseEntity<?> cancelOrderPost(@PathVariable(name = "orderId") Integer orderId) {
        Integer userId = authService.getAuthenticatedUserId();
        orderService.cancelOrder(orderId, userId);
        
        ApiResponse<String> response = ApiResponse.<String>builder()
                                            .code(200)
                                            .message("Thao tác thành công!")
                                            .data("")
                                            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/{orderId}/detail/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable(name = "orderId") Integer orderId) {
        return cancelOrderPost(orderId);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping({"/{orderId}/pay", "/pay/{orderId}"})
    public ResponseEntity<?> payOrder(@PathVariable(name = "orderId") Integer orderId) {
        Integer userId = authService.getAuthenticatedUserId();
        orderService.confirmPayedOrder(orderId, userId);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Thanh toán đơn hàng thành công!")
                .data("")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping({"", "/"})
    public ResponseEntity<?> getOrders(@RequestParam(required = false, name = "status", defaultValue = "ACTIVE") String status,
                            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                            @RequestParam(required = false, name = "size") Integer size,
                            @RequestParam(required = false, name = "pageSize") Integer pageSize,
                            @RequestParam(required = false, name = "startAt", defaultValue = "2025-01-31") LocalDate startAt,
                            @RequestParam(required = false, name = "endAt", defaultValue = "2100-01-01") LocalDate endAt,
                            @RequestParam(required = false, name = "receiverName") String receiverNameParam,
                            @RequestParam(required = false, name = "reciverName") String reciverNameParam,
                            @RequestParam(required = false, name = "address", defaultValue = "") String address,
                            @RequestParam(required = false, name = "phone", defaultValue = "") String phone,
                            @RequestParam(required = false, name = "sortBy") List<String> sortCriterias,
                            @RequestParam(required = false, name = "sortDir") List<String> sortDirections) {
        
        String receiverName = receiverNameParam != null ? receiverNameParam : (reciverNameParam != null ? reciverNameParam : "");
        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);

        LocalDateTime startAt_ = startAt.atStartOfDay();
        LocalDateTime endAt_ = endAt.atTime(LocalTime.MAX);

        Sort sort = SortParamExtracter.extractFromParams(sortCriterias, sortDirections);
        Page<OrderProjection> data = orderService.searchOrders( PageRequest.of(safePage, limit, sort), 
                                                                address, receiverName, phone, startAt_, endAt_, status);
        
        ApiResponse<Page<OrderProjection>> response = ApiResponse.<Page<OrderProjection>>builder()
                                            .code(200)
                                            .message("Thao tác thành công!")
                                            .data(data)
                                            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping({"/{orderId}", "/{orderId}/detail"})
    public ResponseEntity<?> getOrderDetail(@PathVariable(name = "orderId") Integer orderId) {
        OrderWithItems orderWithItems = orderService.findOrderWithItemsById(orderId);

        ApiResponse<OrderWithItems> response = ApiResponse.<OrderWithItems>builder()
                                            .code(200)
                                            .message("Thao tác thành công!")
                                            .data(orderWithItems)
                                            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // Method alias for backward compatibility
    public ResponseEntity<?> getMethodName(Integer orderId) {
        return getOrderDetail(orderId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping({"/{orderId}/status", "/{orderId}/delivery"})
    public ResponseEntity<?> updateOrderStatus(@PathVariable(name = "orderId") Integer orderId) {
        return confirmSendingOrder(orderId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping({"/set-sending/{orderId}", "/{orderId}/delivery"})
    public ResponseEntity<?> confirmSendingOrder(@PathVariable(name = "orderId") Integer orderId) {
        orderService.confirmSendingOrder(orderId);
        
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(200)
            .message("Cập nhật trạng thái đơn hàng thành DELIVERIED thành công!")
            .data("")
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping({"/my-orders", "/my"})
    public ResponseEntity<?> getMyOrders(
            @RequestParam(required = false, name = "status", defaultValue = "") String status,
            @RequestParam(required = false, name = "startAt") LocalDate startDate,
            @RequestParam(required = false, name = "endAt") LocalDate endDate,
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size") Integer size,
            @RequestParam(required = false, name = "pageSize") Integer pageSize) {

        Integer userId = authService.getAuthenticatedUserId();
        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);

        LocalDateTime startDateTime = (startDate == null) ? LocalDateTime.MIN : startDate.atStartOfDay();
        LocalDateTime endDateTime = (endDate == null) ? LocalDateTime.MAX : endDate.atTime(LocalTime.MAX);

        Page<OrderProjection> data = orderService.searchUserOrders(
                userId, PageRequest.of(safePage, limit, Sort.by(Sort.Direction.DESC, "createdAt")),
                status, startDateTime, endDateTime);

        ApiResponse<Page<OrderProjection>> response = ApiResponse.<Page<OrderProjection>>builder()
                .code(200)
                .message("Lấy danh sách đơn hàng thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/bought-items")
    public ResponseEntity<?> getBoughtItems(
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size") Integer size,
            @RequestParam(required = false, name = "pageSize") Integer pageSize) {

        Integer userId = authService.getAuthenticatedUserId();
        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);

        Page<BoughtItemProjection> data = orderService.findBoughtItemsByUserId(userId, PageRequest.of(safePage, limit));

        ApiResponse<Page<BoughtItemProjection>> response = ApiResponse.<Page<BoughtItemProjection>>builder()
                .code(200)
                .message("Lấy danh sách các sản phẩm đã mua thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

