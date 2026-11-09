package com.example.shop.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.dto.projection_interface.BoughtItemProjection;
import com.example.shop.dto.projection_interface.OrderProjection;
import com.example.shop.dto.projection_interface.OrderWithItems;
import com.example.shop.dto.projection_interface.ProductWithDiscount;
import com.example.shop.dto.request.CartItemRequest;
import com.example.shop.dto.request.CreateOrderRequest;
import com.example.shop.dto.request.UpdateOrderInfoRequest;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.User;
import com.example.shop.enums.OrderStatus;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.exception.ActionUnavailableException;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.helper.Converter;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.repository.specification.OrderSpecification;
import com.example.shop.service.context.CreateOrderContext;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartItemRepository cartItemRepository,
                        EventRepository eventRepository,
                        UserRepository userRepository,
                        ProductVariantRepository productVariantRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.productVariantRepository = productVariantRepository;
    }


    public Long calTotalPriceByOrderId(Integer orderId) {

        Long totalPrice = orderRepository.getTotalOrderPriceById(orderId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy đơn hàng!")
        );

        return Converter.convertPriceFromDoubleToLong(1.0 * totalPrice);
    }

    private CreateOrderContext buildCreateOrderContext(CreateOrderRequest request, Integer userId) {
        List<CartItemRequest> orderItemRequests = request.getOrderItems();
        Map<Integer, Integer> quantityMapByCartItemId = orderItemRequests.stream().collect(
            Collectors.toMap(
                CartItemRequest::getCartItemId, 
                CartItemRequest::getQuantity)
        );

        // Lấy danh sách cartItem
        Set<CartItem> cartItems = cartItemRepository.findCartItemsWithVariantAndProductByIdsAndUserId(quantityMapByCartItemId.keySet(), userId);
        if(cartItems.size() != quantityMapByCartItemId.keySet().size()) {
            throw new ActionUnavalibleException("Item không tồn tại trong giỏ hàng của bạn!");
        }

        // Lấy danh sách productId
        Set<Integer> productIds = cartItems.stream().map(
            (cartItem) -> cartItem.getProductVariant().getProduct().getId()
        ).collect(Collectors.toSet());

        Set<ProductWithDiscount> productIdWithDiscounts = eventRepository.findDiscountByProductId(productIds);
        Map<Integer, Integer> discountMapByProductId = productIdWithDiscounts.stream().collect(
            Collectors.toMap(
                ProductWithDiscount::getProductId,
                ProductWithDiscount::getDiscount)
        );

        return new CreateOrderContext(request, userId, quantityMapByCartItemId, cartItems, discountMapByProductId);
    }

    private void validateVariantsAvalibility(CreateOrderContext context) {

        Set<CartItem> cartItems = context.getCartItems();

        for(CartItem cartItem : cartItems) {
            ProductVariant pv = cartItem.getProductVariant();
            if(pv.getStatus() != ProductVariantStatus.AVALIBLE) {
                throw new ActionUnavalibleException("Biến thể có mã: " + pv.getId() + " đang không trong trạng thái có thể giao dịch!");
            }
        }
    }

    private void deductStock(CreateOrderContext context) {

        Set<CartItem> cartItems = context.getCartItems();
        Map<Integer, Integer> quantityMapByCartItemId = context.getQuantityMap();

        for(CartItem cartItem : cartItems) {
            ProductVariant pv = cartItem.getProductVariant();
            Integer updatedRows = productVariantRepository.decreseStock(pv.getId(), quantityMapByCartItemId.get(cartItem.getId()));
            if(updatedRows == 0) {
                throw new ActionUnavalibleException("Số lượng biến thể có mã: " + pv.getId() + " không đủ!");
            }
        }   
    }

    private Order createOrder(CreateOrderContext context) {

        CreateOrderRequest request = context.getRequest();
        Integer userId = context.getUserId();
        Set<CartItem> cartItems = context.getCartItems();
        Map<Integer, Integer> discountMapByProductId = context.getDiscountMap();
        Map<Integer, Integer> quantityMapByCartItemId = context.getQuantityMap();

        User orderedUser = userRepository.findUserById(userId);
        Order order =  Order.builder()
                            .address(request.getReceiverAddress())
                            .phone(request.getReceiverPhone())
                            .name(request.getReceiverName())
                            .user(orderedUser)
                            .build();

        // tính toán discount cho từng sản phẩm --> Tạo orderitem tương ứng
        for(CartItem cartItem : cartItems) {
            ProductVariant pv = cartItem.getProductVariant();
            int discount = 0;
            if (discountMapByProductId != null && pv.getProduct() != null) {
                Integer d = discountMapByProductId.get(pv.getProduct().getId());
                if (d != null) {
                    discount = d;
                }
            }

            // pv.setQuantity(pv.getQuantity() - quantityMapByCartItemId.get(cartItem.getId()));

            OrderItem orderItem = OrderItem.builder()
                                            .discount(discount)
                                            .order(order)
                                            .productVariant(pv)
                                            .price(Converter.convertPriceFromDoubleToLong(1.0 * (pv.getPurchasePrice() * (100.0 - 1.0 * discount) / 100.0)))
                                            .quantity(quantityMapByCartItemId.get(cartItem.getId()))
                                            .build();
            
            order.addOrderItem(orderItem);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cordinateOrderCreation(CreateOrderRequest request, Integer userId) {

        CreateOrderContext context = buildCreateOrderContext(request, userId);
        
        // Check số lượng và trạng thái của từng biến thể tương ứng
        validateVariantsAvalibility(context);

        // Trừ kho
        deductStock(context);

        // Tạo và lưu đối tượng Order cùng với các Item
        Order savedOrder = createOrder(context);

        // Xóa cartItem khỏi giỏ hàng
        cartItemRepository.deleteAll(context.getCartItems());

        return savedOrder;
    }

    @Transactional
    public void updateOrderInfor(UpdateOrderInfoRequest request, Integer orderId, Integer userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy đơn hàng!")
        );

        if(order.getStatus() != OrderStatus.PENDING) {
            throw new ActionUnavalibleException("Trạng thái đơn hàng không hợp lệ để tiến hành cập nhập!");
        }

        if(request.getCoinBeingUsed() != null && request.getCoinBeingUsed() > 0) {
            Long preApplyCoinPrice = calTotalPriceByOrderId(orderId);
            if(request.getCoinBeingUsed() > preApplyCoinPrice) {
                throw new ActionUnavalibleException("Lỗi! Số tiền phải trả: " + preApplyCoinPrice +" || Coin sử dụng: " + request.getCoinBeingUsed());
            }

            int updated = userRepository.deductCoin(userId, request.getCoinBeingUsed());
            if(updated == 0) {
                User user = userRepository.findUserById(userId);
                throw new ActionUnavalibleException("Không đủ! Coin đang có: " + user.getCoin() + " || Coin sử dụng: " + request.getCoinBeingUsed());
            }

            order.setCoinUsed(order.getCoinUsed() + request.getCoinBeingUsed());
        }

        if(request.getReceiverAddress() != null && !request.getReceiverAddress().isBlank()) {
            order.setAddress(request.getReceiverAddress());
        }
        if(request.getReceiverPhone() != null && !request.getReceiverPhone().isBlank()) {
            order.setPhone(request.getReceiverPhone());
        }
        if(request.getReceiverName() != null && !request.getReceiverName().isBlank()) {
            order.setName(request.getReceiverName());
        }

        orderRepository.save(order);
    }

    public void checkOrderCancelationContditions(Order order, Integer userId) {
        if(order.getStatus() != OrderStatus.PENDING) {
            throw new ActionUnavalibleException("Trạng thái không hợp lệ!");
        }

        if(!order.getUser().getId().equals(userId)) {
            throw new ActionUnavalibleException("Thông tin không hợp lệ!");
        }
    }

    public void restoreInventory(Order order) {
        for(OrderItem orderItem : order.getOrderItems()) {
            ProductVariant pv = orderItem.getProductVariant();
            Integer updatedRow = productVariantRepository.increaseStock(pv.getId(), orderItem.getQuantity());
            if(updatedRow == 0) {
                throw new RuntimeException("Lỗi database");
            }
        }
    }

    @Transactional
    public void cancelOrder(Integer orderId, Integer userId) {

        // Tìm Order
        Order order = orderRepository.findOrderWithItemsAndVariantsById(orderId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy đơn hàng!")
        );

        // Kiểm tra điều kiện hủy đơn hàng
        checkOrderCancelationContditions(order, userId);

        // Hoàn lại coin nếu đơn có dùng coin
        if(order.getCoinUsed() != null && order.getCoinUsed() > 0) {
            userRepository.addCoin(order.getUser().getId(), order.getCoinUsed());
            order.setCoinUsed(0L);
        }

        // Đổi trạng thái và lưu lại db
        order.setStatus(OrderStatus.CANCEL);
        orderRepository.save(order);

        // Cộng lại số lượng vào kho
        restoreInventory(order);
    }

    public void confirmSendingOrder(Integer orderId) {
        Order order = orderRepository.findOrderById(orderId);
        order.setStatus(OrderStatus.DELIVERIED);
        orderRepository.save(order);
    }

    @Transactional
    public void confirmPayedOrder(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy đơn hàng!")
        );

        if (userId != null && !order.getUser().getId().equals(userId)) {
            throw new ActionUnavailableException("Bạn không có quyền thanh toán đơn hàng này!");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ActionUnavailableException("Đơn hàng không ở trạng thái chờ thanh toán!");
        }

        if (order.getExpriedAt() != null && LocalDateTime.now().isAfter(order.getExpriedAt())) {
            order.setStatus(OrderStatus.EXPRIED);
            orderRepository.save(order);
            throw new ActionUnavailableException("Đơn hàng đã hết hạn thanh toán!");
        }

        order.setStatus(OrderStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    public void confirmPayedOrder(Integer orderId) {
        confirmPayedOrder(orderId, null);
    }

    public Page<OrderProjection> searchOrders(Pageable pageable, 
                                            String address, String receiverName, String phone,
                                            LocalDateTime startAt, LocalDateTime endAt, String status) {
        
        Specification<Order> spec = Specification.where(OrderSpecification.hasAddress(address))
                                        .and(OrderSpecification.hasPhone(phone))
                                        .and(OrderSpecification.hasReceiverName(receiverName))
                                        .and(OrderSpecification.hasStatus(status))
                                        .and(OrderSpecification.isCreatedBetWeen(startAt, endAt));
        
        return orderRepository.findBy(spec, p -> p.as(OrderProjection.class)
                                                    .page(pageable));
    }

    public Page<OrderProjection> searchUserOrders(Integer userId, Pageable pageable, 
                                                String status, LocalDateTime startAt, LocalDateTime endAt) {
        Specification<Order> spec = Specification.where(OrderSpecification.hasUserId(userId))
                                        .and(OrderSpecification.hasStatus(status))
                                        .and(OrderSpecification.isCreatedBetWeen(startAt, endAt));

        return orderRepository.findBy(spec, p -> p.as(OrderProjection.class).page(pageable));
    }

    public Page<BoughtItemProjection> findBoughtItemsByUserId(Integer userId, Pageable pageable) {
        return orderItemRepository.findBoughtItemsByUserId(userId, pageable);
    }

    public OrderWithItems findOrderWithItemsById(Integer orderId) {
        return orderRepository.findOrderWithItemsById(orderId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy đơn hàng!")
        );
    }

    public OrderWithItems finOrderWithItemsById(Integer orderId) {
        return findOrderWithItemsById(orderId);
    }


}
