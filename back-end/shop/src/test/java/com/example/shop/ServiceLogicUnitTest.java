package com.example.shop;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.shop.dto.request.CreateNewEventRequest;
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
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.service.CartService;
import com.example.shop.service.EventService;
import com.example.shop.service.OrderService;

@ExtendWith(MockitoExtension.class)
class ServiceLogicUnitTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductVariantRepository productVariantRepository;
    @Mock
    private ProductRepository productRepository;

    private OrderService orderService;
    private EventService eventService;
    private CartService cartService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, orderItemRepository, cartItemRepository,
                eventRepository, userRepository, productVariantRepository);
        eventService = new EventService(productRepository, eventRepository);
        cartService = new CartService(cartItemRepository, userRepository, productVariantRepository);
    }

    @Test
    void testCancelOrder_RestoresInventoryAndRefundsCoin() {
        Integer orderId = 100;
        Integer userId = 1;

        User user = User.builder().id(userId).coin(5000L).build();
        ProductVariant variant = ProductVariant.builder().id(10).quantity(5).build();
        OrderItem item = OrderItem.builder().id(50).productVariant(variant).quantity(2).build();

        Order order = Order.builder()
                .id(orderId)
                .status(OrderStatus.PENDING)
                .user(user)
                .coinUsed(2000L)
                .orderItems(Set.of(item))
                .build();

        when(orderRepository.findOrderWithItemsAndVariantsById(orderId)).thenReturn(Optional.of(order));
        when(productVariantRepository.increaseStock(eq(10), eq(2))).thenReturn(1);

        orderService.cancelOrder(orderId, userId);

        // Verify status changed to CANCEL
        assertEquals(OrderStatus.CANCEL, order.getStatus());
        // Verify coin refund was called
        verify(userRepository, times(1)).addCoin(userId, 2000L);
        // Verify stock was restored
        verify(productVariantRepository, times(1)).increaseStock(10, 2);
        // Verify order saved
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testUpdateOrderInfor_DeductsCoinAtomically() {
        Integer orderId = 100;
        Integer userId = 1;

        Order order = Order.builder()
                .id(orderId)
                .status(OrderStatus.PENDING)
                .coinUsed(0L)
                .build();

        UpdateOrderInfoRequest request = new UpdateOrderInfoRequest();
        request.setCoinBeingUsed(1000L);
        request.setReciverAddress("123 Street");
        request.setReciverName("John");
        request.setReciverPhone("0987654321");

        when(orderRepository.findByIdAndUserId(orderId, userId)).thenReturn(Optional.of(order));
        when(orderRepository.getTotalOrderPriceById(orderId)).thenReturn(Optional.of(50000L));
        when(userRepository.deductCoin(userId, 1000L)).thenReturn(1); // Success

        orderService.updateOrderInfor(request, orderId, userId);

        assertEquals(1000L, order.getCoinUsed());
        assertEquals("123 Street", order.getAddress());
        verify(userRepository, times(1)).deductCoin(userId, 1000L);
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testUpdateOrderInfor_FailsWhenInsufficientCoin() {
        Integer orderId = 100;
        Integer userId = 1;

        Order order = Order.builder()
                .id(orderId)
                .status(OrderStatus.PENDING)
                .coinUsed(0L)
                .build();

        UpdateOrderInfoRequest request = new UpdateOrderInfoRequest();
        request.setCoinBeingUsed(10000L);

        User user = User.builder().id(userId).coin(500L).build();

        when(orderRepository.findByIdAndUserId(orderId, userId)).thenReturn(Optional.of(order));
        when(orderRepository.getTotalOrderPriceById(orderId)).thenReturn(Optional.of(50000L));
        when(userRepository.deductCoin(userId, 10000L)).thenReturn(0); // Insufficient coin
        when(userRepository.findUserById(userId)).thenReturn(user);

        assertThrows(ActionUnavalibleException.class, () -> {
            orderService.updateOrderInfor(request, orderId, userId);
        });

        verify(orderRepository, never()).save(order);
    }

    @Test
    void testEventService_CreateEventDuplicateTitleThrows400() {
        CreateNewEventRequest request = new CreateNewEventRequest();
        request.setTitle("Summer Sale");

        when(eventRepository.existsByTitleIgnoreCase("Summer Sale")).thenReturn(true);

        assertThrows(ActionUnavalibleException.class, () -> {
            eventService.createNewEvent(request);
        });
    }

    @Test
    void testConfirmPayedOrder_Success() {
        Integer orderId = 100;
        Integer userId = 1;
        User user = User.builder().id(userId).build();
        Order order = Order.builder()
                .id(orderId)
                .status(OrderStatus.PENDING)
                .user(user)
                .expriredat(LocalDateTime.now().plusHours(1))
                .build();

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        orderService.confirmPayedOrder(orderId, userId);

        assertEquals(OrderStatus.PAID, order.getStatus());
        assertNotNull(order.getPaidAt());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testConfirmPayedOrder_ExpiredThrowsException() {
        Integer orderId = 100;
        Integer userId = 1;
        User user = User.builder().id(userId).build();
        Order order = Order.builder()
                .id(orderId)
                .status(OrderStatus.PENDING)
                .user(user)
                .expriredat(LocalDateTime.now().minusHours(1))
                .build();

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        assertThrows(ActionUnavailableException.class, () -> {
            orderService.confirmPayedOrder(orderId, userId);
        });

        assertEquals(OrderStatus.EXPRIED, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testConfirmPayedOrder_InvalidStatusThrowsException() {
        Integer orderId = 100;
        Integer userId = 1;
        User user = User.builder().id(userId).build();
        Order order = Order.builder()
                .id(orderId)
                .status(OrderStatus.CANCEL)
                .user(user)
                .build();

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        assertThrows(ActionUnavailableException.class, () -> {
            orderService.confirmPayedOrder(orderId, userId);
        });
    }

    @Test
    void testUpdateCartItemQuantity_Success() {
        Integer cartItemId = 10;
        Integer userId = 1;
        User user = User.builder().id(userId).build();
        ProductVariant pv = ProductVariant.builder().id(5).quantity(20).build();
        CartItem cartItem = CartItem.builder().id(cartItemId).user(user).productVariant(pv).quantity(2).build();

        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CartItem updated = cartService.updateCartItemQuantity(cartItemId, 5, userId);

        assertNotNull(updated);
        assertEquals(5, updated.getQuantity());
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void testUpdateCartItemQuantity_InsufficientStockThrowsException() {
        Integer cartItemId = 10;
        Integer userId = 1;
        User user = User.builder().id(userId).build();
        ProductVariant pv = ProductVariant.builder().id(5).quantity(3).build();
        CartItem cartItem = CartItem.builder().id(cartItemId).user(user).productVariant(pv).quantity(2).build();

        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(cartItem));

        assertThrows(ActionUnavailableException.class, () -> {
            cartService.updateCartItemQuantity(cartItemId, 10, userId);
        });
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void testUpdateCartItemQuantity_UnauthorizedUserThrowsException() {
        Integer cartItemId = 10;
        Integer ownerUserId = 1;
        Integer otherUserId = 2;
        User user = User.builder().id(ownerUserId).build();
        ProductVariant pv = ProductVariant.builder().id(5).quantity(20).build();
        CartItem cartItem = CartItem.builder().id(cartItemId).user(user).productVariant(pv).quantity(2).build();

        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(cartItem));

        assertThrows(ActionUnavailableException.class, () -> {
            cartService.updateCartItemQuantity(cartItemId, 5, otherUserId);
        });
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }
}

