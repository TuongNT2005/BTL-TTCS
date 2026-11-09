package com.example.shop.repository.specification;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.Specification;

import com.example.shop.entity.Order;
import com.example.shop.enums.OrderStatus;

        // - status
        // - createdAt
        // - name
        // - phone
        // - address
public class OrderSpecification {

    public static Specification<Order> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isBlank()) {
                return null;
            }
            try {
                OrderStatus inStatus = OrderStatus.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), inStatus);
            } catch (Exception e) {
                return null;
            }
        };
    }

    public static Specification<Order> hasUserId(Integer userId) {
        return (root, query, cb) -> {
            if (userId == null) {
                return null;
            }
            return cb.equal(root.join("user").get("id"), userId);
        };
    }

    public static Specification<Order> isCreatedBetWeen(LocalDateTime startAt, LocalDateTime endAt) {
        return (root, query, cb) -> {
            if(startAt == null || endAt == null) {
                return null;
            }
            return cb.between(root.get("createdAt"), startAt, endAt);
        };
    }

    public static Specification<Order> hasPhone(String phone) {
        return (root, query, cb) -> {
            if(phone == null || phone.isBlank()) {
                return null;
            }
            return cb.like( cb.lower(root.get("phone")), 
                            "%" + phone.toLowerCase() + "%");
        };
    }

    public static Specification<Order> hasReceiverName(String receiverName) {
        return (root, query, cb) -> {
            if(receiverName == null || receiverName.isBlank()) {
                return null;
            }
            return cb.like( cb.lower(root.get("name")), 
                            "%" + receiverName.toLowerCase() + "%");
        };
    }

    public static Specification<Order> hasReciverName(String reciverName) {
        return hasReceiverName(reciverName);
    }

    public static Specification<Order> hasAddress(String address) {
        return (root, query, cb) -> {
            if(address == null || address.isBlank()) {
                return null;
            }
            return cb.like( cb.lower(root.get("address")), 
                            "%" + address.toLowerCase() + "%");
        };
    }
}
