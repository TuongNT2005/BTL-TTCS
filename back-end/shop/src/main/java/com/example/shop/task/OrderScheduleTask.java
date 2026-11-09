package com.example.shop.task;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.entity.Order;
import com.example.shop.enums.OrderStatus;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class OrderScheduleTask {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderScheduleTask(OrderRepository orderRepository,
                             OrderService orderService,
                             UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    /**
     * Tự động quét các đơn hàng PENDING đã quá hạn thanh toán (24 giờ) mỗi 15 phút.
     * Cập nhật trạng thái đơn thành EXPRIED, hoàn trả số lượng vào kho và hoàn lại xu nếu có.
     */
    @Scheduled(cron = "0 */15 * * * *")
    @Transactional
    public void scanAndCancelExpiredOrders() {
        LocalDateTime now = LocalDateTime.now();
        List<Order> expiredOrders = orderRepository.findByStatusAndExpriredatBefore(OrderStatus.PENDING, now);

        if (expiredOrders.isEmpty()) {
            return;
        }

        log.info("Bắt đầu xử lý {} đơn hàng quá hạn thanh toán...", expiredOrders.size());

        for (Order order : expiredOrders) {
            try {
                // Hoàn lại coin nếu đơn có dùng coin
                if (order.getCoinUsed() != null && order.getCoinUsed() > 0 && order.getUser() != null) {
                    userRepository.addCoin(order.getUser().getId(), order.getCoinUsed());
                    order.setCoinUsed(0L);
                }

                // Cập nhật trạng thái sang EXPRIED
                order.setStatus(OrderStatus.EXPRIED);
                orderRepository.save(order);

                // Hoàn lại tồn kho
                orderService.restoreInventory(order);

                log.info("Đã hủy đơn hàng quá hạn ID: {}", order.getId());
            } catch (Exception e) {
                log.error("Lỗi khi xử lý hủy đơn hàng quá hạn ID {}: {}", order.getId(), e.getMessage());
            }
        }
    }
}

