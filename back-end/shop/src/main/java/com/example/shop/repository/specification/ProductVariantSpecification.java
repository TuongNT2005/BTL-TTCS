package com.example.shop.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.shop.entity.ProductVariant;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;

public class ProductVariantSpecification {

    public static Specification<ProductVariant> hasProductName(String productName) {
        return (root, query, cb) -> {
            if (productName == null || productName.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.join("product").get("name")),
                    "%" + productName.toLowerCase() + "%");
        };
    }

    public static Specification<ProductVariant> hasColor(String colorName) {
        return (root, query, cb) -> {
            if (colorName == null || colorName.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.join("color").get("name")),
                    "%" + colorName.toLowerCase() + "%");
        };
    }

    public static Specification<ProductVariant> hasSize(String size) {
        return (root, query, cb) -> {
            if (size == null || size.isBlank()) {
                return null;
            }
            try {
                Size sizeEnum = Size.valueOf(size.toUpperCase());
                return cb.equal(root.get("size"), sizeEnum);
            } catch (Exception e) {
                return null;
            }
        };
    }

    public static Specification<ProductVariant> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isBlank()) {
                return null;
            }
            try {
                ProductVariantStatus statusEnum = ProductVariantStatus.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), statusEnum);
            } catch (Exception e) {
                return null;
            }
        };
    }

    public static Specification<ProductVariant> hasProductId(Integer productId) {
        return (root, query, cb) -> {
            if (productId == null) {
                return null;
            }
            return cb.equal(root.join("product").get("id"), productId);
        };
    }
}

