package com.example.shop.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.shop.entity.Product;
import com.example.shop.enums.Category;

public class ProductSpecification {
    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("name")),
                    "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) -> {

            if(category == null) return null;

            try {
                Category categoryObj = Category.valueOf(category.toUpperCase());
                return cb.equal(root.get("category"), categoryObj);
            } catch (Exception e) {
                return null;
            }
        };
    }
}
