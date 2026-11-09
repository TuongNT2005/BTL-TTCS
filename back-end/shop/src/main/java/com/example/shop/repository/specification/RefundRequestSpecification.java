package com.example.shop.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.shop.entity.RefundRequest;
import com.example.shop.enums.RefundStatus;

public class RefundRequestSpecification {

    public static Specification<RefundRequest> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isBlank()) {
                return null;
            }
            try {
                RefundStatus statusEnum = RefundStatus.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), statusEnum);
            } catch (Exception e) {
                return null;
            }
        };
    }

    public static Specification<RefundRequest> hasUserId(Integer userId) {
        return (root, query, cb) -> {
            if (userId == null) {
                return null;
            }
            return cb.equal(root.join("user").get("id"), userId);
        };
    }

    public static Specification<RefundRequest> hasProductName(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.join("orderItem")
                                       .join("productVariant")
                                       .join("product")
                                       .get("name")), 
                           "%" + keyword.toLowerCase() + "%");
        };
    }
}

