package com.example.shop.repository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.shop.dto.projection_interface.CartItemWithProductVariant;
import com.example.shop.entity.CartItem;

import io.lettuce.core.dynamic.annotation.Param;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
        public Optional<CartItem> findByUserIdAndProductVariantId(Integer userId, Integer productVariantId);

        public Page<CartItem> findAllByUserId(Integer userId, Pageable pageable);

        @Query("""
                        SELECT ci
                        FROM CartItem ci
                        JOIN FETCH ci.productVariant pv
                        JOIN FETCH pv.product p
                        WHERE ci.id IN :cartItemIds AND ci.user.id = :userId
                        """)
        public Set<CartItem> findCartItemsWithVariantAndProductByIdsAndUserId(
                        @Param("cartItemIds") Collection<Integer> cartItemIds,
                        @Param("userId") Integer userId);


        @Query("""
                        SELECT ci.id as id, concat(p.name, "-", c.name, "-", pv.size) as name, ci.quantity as quantity
                        FROM CartItem ci
                        JOIN ci.user u
                        JOIN ci.productVariant pv
                        JOIN pv.product p
                        JOIN pv.color c
                        WHERE u.id = :userId
                        """)
        public Page<CartItemWithProductVariant> findCartItemWithProductVariantByUserId(Pageable pageable,
                        @Param(value = "userId") Integer userId);
}
