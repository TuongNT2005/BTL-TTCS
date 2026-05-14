package com.example.shop.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.dto.request.UpdateOrderInforRequest;
import com.example.shop.dto.response.OrderDTO;
import com.example.shop.dto.response.OrderItemDTO;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.User;
import com.example.shop.enums.OrderStatus;
import com.example.shop.enums.Returned;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.util.ConstantVal;
import com.example.shop.util.Converter;

@Service
public class OrderService {

    @Autowired
    private CartService cartService;
    @Autowired
    private ProductService productService;
    @Autowired
    private EventService eventService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private UserService userService;
    @Autowired
    ColorService colorService;

    public OrderDTO convertToOrderDTO(Order order) {

        User user = userService.findUserById(order.getUserId());
        List<OrderItem> orderItems = findOrderItemsByOrderId(order.getId());
        List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
        for (OrderItem orderItem : orderItems) {
            orderItemDTOs.add(convertToOrderItemDTO(orderItem));
        }

        return OrderDTO.builder()
                .order(order)
                .createdAt(Converter.formatDateTime(order.getCreatedAt()))
                .expiredAt(Converter.formatDateTime(order.getExpriredat()))
                .user(userService.convertToUserDTO(user))
                .orderItems(orderItemDTOs)
                .price(calTotalPriceByOrderId(order.getId()))   
                .build();
    }

    public OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
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

    @Transactional
    public Order createNewOrder(List<Integer> cartItemIds, List<Integer> quantities, User user) {

        List<CartItem> cartItems = new ArrayList<>();
        for (int cartItemId : cartItemIds) {
            CartItem cartItem = cartService.findCartItemById(cartItemId);
            cartItems.add(cartItem);
        }

        List<ProductVariant> productVariants = new ArrayList<>();
        for (Integer i = 0; i < cartItemIds.size(); i++) {
            CartItem cartItem = cartItems.get(i);
            Integer productVariantId = cartItem.getProductVariantId();
            ProductVariant productVariant = productService.findProductVariantById(productVariantId);

            // Kiểm tra số lượng và trạng thái
            productService.checkProductVariantStatus(productVariantId);
            productService.checkQuantity(productVariantId, quantities.get(i));

            productVariants.add(productVariant);
        }

        try {
            Order order = Order.builder()
                    .address(user.getAddress())
                    .phone(user.getPhone())
                    .coinUsed(0l)
                    .createdAt(LocalDateTime.now())
                    .expriredat(LocalDateTime.now().plusDays(1l * ConstantVal.paymentDayDuration))
                    .paidAt(null)
                    .status(OrderStatus.PENDING)
                    .userId(user.getId())
                    .build();
            orderRepository.save(order);

            for (int i = 0; i < productVariants.size(); i++) {
                ProductVariant productVariant = productVariants.get(i);
                CartItem cartItem = cartItems.get(i);

                // Cập nhập số lượng
                productVariant.setQuantity(productVariant.getQuantity() - quantities.get(i));
                productService.saveProductVariant(productVariant);

                // Tính toán discount
                Integer discount = eventService.findDiscounts(productVariant.getProductId());
                OrderItem orderItem = OrderItem.builder()
                        .discount(discount)
                        .orderId(order.getId())
                        .price(Converter.convertPriceFromDoubleToLong(
                                Math.floor(productVariant.getPurchasePrice() * (100 - discount) / 100)))
                        .productVariantId(productVariant.getId())
                        .quantity(quantities.get(i))
                        .returned(Returned.FALSE)
                        .build();

                orderItemRepository.save(orderItem);
                cartService.deleteCartItem(cartItem);

            }

            return order;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Page<OrderDTO> findAllOrdersByUser(User user, Integer page) {
        try {
             Page<Order> orders = orderRepository.findAllByUserId(PageRequest.of(page, ConstantVal.itemPerPage) ,user.getId());
             return orders.map(order -> convertToOrderDTO(order));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
       

    }

    // Tìm kiếm đơn hàng theo id
    public Order findOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(String.format("Order với id=%s không tồn tại!", orderId)));
    }

    // Tìm kiếm các sản phẩm trong 1 đơn hàng theo id
    public List<OrderItem> findOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findAllByOrderId(orderId);
    }

    // Kiểm tra trạng thái của đơn hàng có phải là pending không
    public void checkIsPendingOrder(Integer orderId) {
        Order order = findOrderById(orderId);
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ActionUnavalibleException(
                    String.format("Đơn hàng với id=%d này đã %s", orderId, order.getStatus().toString()));
        }
    }

    // Kiểm tra đơn hàng đẫ hết hạn hay chưa
    public void checkOrderExpiration(Integer orderId) {
        Order order = findOrderById(orderId);
        if (order.getExpriredat().isBefore(LocalDateTime.now()) && order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.EXPRIED);
            orderRepository.save(order);
            throw new ActionUnavalibleException(
                    String.format("Đơn hàng với id=%d đã %s", orderId, order.getStatus().toString()));
        }
    }

    public Order cancelOrder(Integer orderId) {
        // Kiểm tra order
        Order order = findOrderById(orderId);
        checkIsPendingOrder(orderId);
        checkOrderExpiration(orderId);

        // Cập nhập trạng thái đơn hàng
        order.setStatus(OrderStatus.CANCEL);
        orderRepository.save(order);

        // Tìm các orderItem ứng với orderId
        List<OrderItem> orderItems = findOrderItemsByOrderId(orderId);

        // Cập nhập số lượng
        for (OrderItem orderItem : orderItems) {
            Integer productVariantId = orderItem.getProductVariantId();
            ProductVariant productVariant = productService.findProductVariantById(productVariantId);
            productVariant.setQuantity(productVariant.getQuantity() + orderItem.getQuantity());
            productService.saveProductVariant(productVariant);
        }

        return order;
    }

    public OrderItem findOrderItemById(Integer orderItemId) {
        return orderItemRepository.findById(orderItemId)
                .orElseThrow(
                        () -> new NotFoundException(String.format("OrderItem với id=%d không tồn tại!", orderItemId)));
    }

    public Long calTotalPriceByOrderId(Integer orderId) {
        Order order = findOrderById(orderId);
        List<OrderItem> orderItems = findOrderItemsByOrderId(orderId);
        Long totalPrice = 0l;
        for (OrderItem orderItem : orderItems) {
            totalPrice += 1l * orderItem.getPrice() * orderItem.getQuantity();
        }
        return Converter.convertPriceFromDoubleToLong(1.0 * (totalPrice - order.getCoinUsed()));
    }

    @Transactional
    public Order comfirmPurchasedOrder(Map<String, String> paymentResult) { 
        Integer orderId = Integer.valueOf(paymentResult.get("vnp_TxnRef"));
        Order order = findOrderById(orderId);

        try {
            if (paymentResult.get("vnp_TransactionStatus").equals("00") &&
                    paymentResult.get("vnp_TransactionStatus").equals("00")) {
                order.setStatus(OrderStatus.PAID);
                order.setPaidAt(LocalDateTime.now());

                User user = userService.findUserById(order.getUserId());
                user.setCoin(user.getCoin() - order.getCoinUsed()
                        + Converter.convertPriceFromDoubleToLong(1.0 * calTotalPriceByOrderId(orderId) / 20.0));

                orderRepository.save(order);
                userService.saveUser(user);
            }

            return order;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public OrderDTO getOrderDTObyOrderId(Integer orderId) {
        try {
            Order order = findOrderById(orderId);
            return convertToOrderDTO(order);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }

    public Page<OrderDTO> findOrderByStatus(String status, Integer page) {
        try {
            Page<Order> orders = orderRepository.findAllByStatus(PageRequest.of(page, ConstantVal.itemPerPage), status);
            Page<OrderDTO> orderDTOs = orders.map(order -> {
                return convertToOrderDTO(order);
            });
            return orderDTOs;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }

    public Order comfirmSendingOrder(Integer orderId) {
        try {
            Order order = findOrderById(orderId);
            if (order.getStatus().toString() != "PAID") {
                throw new ActionUnavalibleException("Không thể thực hiện do đơn hàng chưa được thanh toán!");
            }
            order.setStatus(OrderStatus.valueOf("DELIVERIED"));
            orderRepository.save(order);
            return order;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Order updateOrderInfor(UpdateOrderInforRequest request, User user) {
        Order order = findOrderById(request.getId());
        checkIsPendingOrder(request.getId());
        checkOrderExpiration(request.getId());

        try {

            if(request.getUsedCoin()==null || request.getAddress()==null || request.getAddress().trim().equals("") || request.getPhone()==null || request.getPhone().trim().equals("")) {
                throw new ActionUnavalibleException("Thông tin không đầy đủ!");
            }

            if(request.getUsedCoin() > user.getCoin()) {
                throw new ActionUnavalibleException("Số coin của bạn không đủ!");
            }

            if(request.getUsedCoin() < 0) {
                throw new ActionUnavalibleException("Số coin ko được âm!");
            }

            user.setCoin(user.getCoin() - request.getUsedCoin());

            order.setCoinUsed(order.getCoinUsed() + request.getUsedCoin());
            order.setAddress(request.getAddress());
            order.setPhone(request.getPhone());

            orderRepository.save(order);
            userService.saveUser(user);
            return order;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Page<OrderItemDTO> findAllBoughtItemByUserId(Integer userId, Integer page) {
        try {
            Page<OrderItem> orderItems = orderItemRepository.findAllBoughtItemByUserId(userId, PageRequest.of(page, ConstantVal.itemPerPage));
            Page<OrderItemDTO> orderItemDtos = orderItems.map(orderItem -> convertToOrderItemDTO(orderItem));
            return orderItemDtos;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
