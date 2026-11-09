package com.example.shop.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.shop.entity.User;
import com.example.shop.enums.UserEnum;

public class UserSpecification {
    public static Specification<User> hasUsername(String username) {
        return (root, querry, cb) -> {
            if(username == null || username.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%");
        };
    }

    public static Specification<User> notHasRole(UserEnum role) {
    return (root, query, cb) -> {
        if (role == null) {
            return null;
        }
        return cb.notEqual(root.get("role"), role);
    };
}
}
