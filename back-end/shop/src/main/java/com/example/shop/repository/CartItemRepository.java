package com.example.shop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shop.entity.CartItem;


public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    // public Optional<CartItem> findByUserIdAndProductVariantId(Integer userId, Integer productVariantId);

    public Page<CartItem> findAllByUserId(Integer userId, Pageable pageable);
}
