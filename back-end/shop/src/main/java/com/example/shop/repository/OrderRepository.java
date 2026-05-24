package com.example.shop.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Order;
import com.example.shop.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query(value = "SELECT * FROM ORDERS WHERE (:status IS NULL OR :status = '' OR STATUS like CONCAT('%', :status, '%'))", nativeQuery = true, countQuery = "SELECT COUNT(*) FROM ORDERS WHERE (:status IS NULL OR :status = '' OR STATUS like CONCAT('%', :status, '%'))")
    public Page<Order> findAllByStatus(Pageable page, @Param(value = "status") String status);

    public Page<Order> findAllByUserId(Pageable page, Integer userId);

    public Long countByStatusAndCreatedAtBetween(OrderStatus status, LocalDateTime startAt, LocalDateTime endAt);

    @Query(value = """
            SELECT sum(oi.price * oi.quantity)
            FROM orders o right join orderItem oi on o.id = oi.orderId 
            WHERE (o.status = 'PAID' or o.status = 'DELIVERIED') 
            AND o.createdAt BETWEEN :startAt AND :endAt;
        """, nativeQuery = true)
    public Long getTotalIncome(@Param(value = "startAt") LocalDateTime startAt, @Param(value = "endAt") LocalDateTime endAt);
    
    @Query(value = """
            select p.category, sum(oi.price * oi.quantity)
            from orderitem oi left join
            orders o on oi.orderId = o.id left join
            productvariant pv on pv.id = oi.productVariantId left join
            product p on p.id = pv.productId
            where (o.status = 'PAID' or o.status = 'DELIVERIED')
            and o.createdAt between :startAt and :endAt
            group by p.category
            """, nativeQuery = true)
    public List<Object[]> getSaleWithCategories(@Param(value = "startAt") LocalDateTime startAt,
                                                @Param(value = "endAt") LocalDateTime endAt);

    @Query(value = """
        with recursive period as (
            select date(:startAt) as date_
            union all
            select date_add(date_, interval 1 month)
            from period
            where date_ < date(:endAt)
        )
        select 
            year(p.date_) as year_, 
            month(p.date_) as month_, 
            coalesce(sum(oi.price * oi.quantity), 0) as income
        from period p
        left join orders o 
            on year(o.createdAt) = year(p.date_) 
            and month(o.createdAt) = month(p.date_)
            and (o.status = 'PAID' or o.status = 'DELIVERIED') 
            and o.createdAt between :startAt and :endAt
        left join orderitem oi on oi.orderId = o.id
        group by year(p.date_), month(p.date_)
        order by year(p.date_) asc, month(p.date_) asc;

            """, nativeQuery = true)
    public List<Object[]> getIncome(@Param(value = "startAt") LocalDateTime startAt,
                                    @Param(value = "endAt") LocalDateTime endAt);

    List<Order> findByStatusAndExpriredatBefore(OrderStatus status, LocalDateTime currentTime);

}
