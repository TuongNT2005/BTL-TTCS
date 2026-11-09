package com.example.shop.repository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.shop.enums.OrderStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.dto.projection_interface.OrderProjection;
import com.example.shop.dto.projection_interface.OrderTotalPriceProjection;
import com.example.shop.dto.projection_interface.OrderWithItems;
import com.example.shop.entity.Order;
import com.example.shop.exception.NotFoundException;

public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    
    @Query("""
            SELECT o
            FROM Order o JOIN o.user u
            WHERE o.id = :orderId AND u.id = :userId
            """)
    public Optional<Order> findByIdAndUserId(@Param(value = "orderId") Integer orderId,
                                             @Param(value = "userId") Integer userId);

    public default Order findOrderById(Integer orderId) {
        return findById(orderId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy đơn hàng!")
        );
    }

    // @Query("""
    //         SELECT o.id as id, o.coinUsed as usedCoin, oi as orderItems 
    //         FROM Order o JOIN o.orderItems oi 
    //         WHERE o.id = :orderId
    //         """)
    @EntityGraph(attributePaths = {"orderItems"})
    public Optional<OrderTotalPriceProjection> findOrderPriceInfoById(@Param(value = "orderId" )Integer orderId);

    @Query("""
            SELECT SUM(oi.quantity * oi.price) - o.coinUsed as totalPrice 
            FROM Order o JOIN o.orderItems oi 
            WHERE o.id = :orderId
            GROUP BY o.id, o.coinUsed
            """)
    public Optional<Long> getTotalOrderPriceById(@Param(value = "orderId" )Integer orderId);

    public List<Order> findByStatusAndExpriredatBefore(OrderStatus status, LocalDateTime currentTime);

    @Query("""
            SELECT o
            FROM Order o 
            JOIN FETCH o.user u
            JOIN FETCH o.orderItems oi
            JOIN FETCH oi.productVariant pv
            WHERE o.id = :orderId
            """)
    public Optional<Order> findOrderWithItemsAndVariantsById(@Param(value = "orderId") Integer orderId);


    public Page<OrderProjection> findBy(Specification<Order> spec, Pageable pageable);
    

    // @EntityGraph(attributePaths = {
    //     "orderItems",
    //     "orderItems.productVariant",
    //     "orderItems.productVariant.color",
    //     "orderItems.productVariant.product"
    // })
    @Query("""
        SELECT o FROM Order o
        LEFT JOIN FETCH o.orderItems oi
        LEFT JOIN FETCH oi.productVariant v
        LEFT JOIN FETCH v.product p
        LEFT JOIN FETCH v.color c
        WHERE o.id = :orderId
    """)
    public Optional<OrderWithItems> findOrderWithItemsById(Integer orderId);

    // @Query(value = "SELECT * FROM ORDERS WHERE (:status IS NULL OR :status = '' OR STATUS like CONCAT('%', :status, '%'))", nativeQuery = true, countQuery = "SELECT COUNT(*) FROM ORDERS WHERE (:status IS NULL OR :status = '' OR STATUS like CONCAT('%', :status, '%'))")
    // public Page<Order> findAllByStatus(Pageable page, @Param(value = "status") String status);

    // public Page<Order> findAllByUserId(Pageable page, Integer userId);

    // public Long countByStatusAndCreatedAtBetween(OrderStatus status, LocalDateTime startAt, LocalDateTime endAt);

    // @Query(value = """
    //         SELECT sum(oi.price * oi.quantity)
    //         FROM orders o right join orderItem oi on o.id = oi.orderId 
    //         WHERE (o.status = 'PAID' or o.status = 'DELIVERIED') 
    //         AND o.createdAt BETWEEN :startAt AND :endAt;
    //     """, nativeQuery = true)
    // public Long getTotalIncome(@Param(value = "startAt") LocalDateTime startAt, @Param(value = "endAt") LocalDateTime endAt);
    
    // @Query(value = """
    //         select p.category, sum(oi.price * oi.quantity)
    //         from orderitem oi left join
    //         orders o on oi.orderId = o.id left join
    //         productvariant pv on pv.id = oi.productVariantId left join
    //         product p on p.id = pv.productId
    //         where (o.status = 'PAID' or o.status = 'DELIVERIED')
    //         and o.createdAt between :startAt and :endAt
    //         group by p.category
    //         """, nativeQuery = true)
    // public List<Object[]> getSaleWithCategories(@Param(value = "startAt") LocalDateTime startAt,
    //                                             @Param(value = "endAt") LocalDateTime endAt);

    // @Query(value = """
    //     with recursive period as (
    //         select date(:startAt) as date_
    //         union all
    //         select date_add(date_, interval 1 month)
    //         from period
    //         where date_ < date(:endAt)
    //     )
    //     select 
    //         year(p.date_) as year_, 
    //         month(p.date_) as month_, 
    //         coalesce(sum(oi.price * oi.quantity), 0) as income
    //     from period p
    //     left join orders o 
    //         on year(o.createdAt) = year(p.date_) 
    //         and month(o.createdAt) = month(p.date_)
    //         and (o.status = 'PAID' or o.status = 'DELIVERIED') 
    //         and o.createdAt between :startAt and :endAt
    //     left join orderitem oi on oi.orderId = o.id
    //     group by year(p.date_), month(p.date_)
    //     order by year(p.date_) asc, month(p.date_) asc;

    //         """, nativeQuery = true)
    // public List<Object[]> getIncome(@Param(value = "startAt") LocalDateTime startAt,
    //                                 @Param(value = "endAt") LocalDateTime endAt);

    // List<Order> findByStatusAndExpriredatBefore(OrderStatus status, LocalDateTime currentTime);

}
