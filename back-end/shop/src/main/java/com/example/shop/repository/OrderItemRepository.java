package com.example.shop.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findAllByOrderId(Integer orderId);

    @Query(
        value = """
            select oi.*
            from orderitem oi
            join orders o on oi.orderId = o.id
            where o.userId = :userId
            and o.status = 'DELIVERIED'
        """,

        countQuery = """
            select count(*)
            from orderitem oi
            join orders o on oi.orderId = o.id
            where o.userId = :userId
            and o.status = 'DELIVERIED'
        """,    
        nativeQuery = true
    )
    Page<OrderItem> findAllBoughtItemByUserId(
        @Param("userId") Integer userId,
        Pageable pageable
    );

    @Query(
        value = """
            SELECT oi FROM OrderItem oi
            JOIN oi.order o
            WHERE o.user.id = :userId AND o.status = com.example.shop.enums.OrderStatus.DELIVERIED
        """,
        countQuery = """
            SELECT count(oi) FROM OrderItem oi
            JOIN oi.order o
            WHERE o.user.id = :userId AND o.status = com.example.shop.enums.OrderStatus.DELIVERIED
        """
    )
    Page<com.example.shop.dto.projection_interface.BoughtItemProjection> findBoughtItemsByUserId(
        @Param("userId") Integer userId,
        Pageable pageable
    );
}