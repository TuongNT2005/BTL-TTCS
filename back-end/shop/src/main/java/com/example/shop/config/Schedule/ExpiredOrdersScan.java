package com.example.shop.config.Schedule;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.shop.service.OrderService;

@Component
public class ExpiredOrdersScan {
    @Autowired OrderService orderService;

    @Scheduled(fixedDelay = 60000 * 60)
    public void run() {
        System.out.println("Hệ thống đnag scan các đơn hàng hết hạn!");
        orderService.scanAndCancelExpiredOrders();
    }
}
