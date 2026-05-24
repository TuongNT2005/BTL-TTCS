package com.example.shop.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.enums.OrderStatus;
import com.example.shop.repository.CommentRepository;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.ImportHistoryRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.RefundRequestRepository;
import com.example.shop.repository.UserRepository;

@Service
public class ReportService {
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductVariantRepository productVariantRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private RefundRequestRepository refundRequestRepository;
    @Autowired private ImportHistoryRepository importHistoryRepository;
    @Autowired private CommentRepository commentRepository;

    public Long countTotalProducts() {
        return productRepository.count();
    }

    public Long countTotalProductVariants() {
        return productVariantRepository.count();
    }

    public Long getTotalAvalibleEvents(LocalDate startAt, LocalDate endAt) {
        Long totalAvalibleEvents = eventRepository.countByStartAtLessThanEqualAndEndAtGreaterThanEqual(endAt, startAt);
        return totalAvalibleEvents == null ? 0 : totalAvalibleEvents;
    }

    public Long getTotalUndeliveriedOrders(LocalDateTime startAt, LocalDateTime endAt) {
        Long totalUndeliveriedOrders = orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.PAID, startAt, endAt);
        return totalUndeliveriedOrders == null ? 0l : totalUndeliveriedOrders;
    }

    public Long getTotalIncome(LocalDateTime startAt, LocalDateTime endAt) {
        Long totalIncome = orderRepository.getTotalIncome(startAt, endAt);
        return totalIncome == null ? 0l : totalIncome;
    }

    public Long countTotalUsers() {
        return userRepository.count();
    }

    public Long getTotalUnhandledRefundRequests(LocalDateTime startAt, LocalDateTime endAt) {
        System.out.println(startAt.getClass());
        Long totalUnhandledRefundRequests = refundRequestRepository.TotalUnhandledRefundRequests(startAt, endAt);
        return totalUnhandledRefundRequests == null ? 0 : totalUnhandledRefundRequests;
    }

    public Long getTotalExpenditure(LocalDateTime startAt, LocalDateTime endAt) {
        Long totalExpenditure = importHistoryRepository.getTotalExpenditure(startAt, endAt);
        return totalExpenditure == null ? 0 : totalExpenditure;
    }

    public List<Object[]> getSaleWithCategories(LocalDateTime startAt, LocalDateTime endAt) {
        try {
            return orderRepository.getSaleWithCategories(startAt, endAt); 
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Object[]> getStarCount() {
        try {
            return commentRepository.getStarCount(); 
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Object[]> getIncomeFigureWithPeriod(LocalDateTime startAt, LocalDateTime endAt) {
        try {
            return orderRepository.getIncome(startAt, endAt);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Object[]> getExpenditureWithPeriod(LocalDateTime startAt, LocalDateTime endAt) {
        try {
            return importHistoryRepository.getExpenditure(startAt, endAt);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Object[]> getTrendProducts(LocalDateTime startAt, LocalDateTime endAt) {
        try {
            return productRepository.getTrendProducts(startAt, endAt);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Object[]> getTopSpendingUsers(LocalDateTime startAt, LocalDateTime endAt) {
        try {
            return userRepository.getTopSpendingUsers(startAt, endAt);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
