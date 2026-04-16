package com.example.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Order;


@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    @Query(value = "SELECT * FROM ORDERS WHERE (:status IS NULL OR :status = '' OR STATUS like CONCAT('%', :status, '%'))", nativeQuery = true,
        countQuery = "SELECT COUNT(*) FROM ORDERS WHERE (:status IS NULL OR :status = '' OR STATUS like CONCAT('%', :status, '%'))"
    )
    public Page<Order> findAllByStatus(Pageable page, @Param(value = "status") String status);
}
