package com.example.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.RefundRequest;
import com.example.shop.enums.RefundStatus;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, Integer> {

    public Page<RefundRequest> findAllByStatus(Pageable pageable, RefundStatus status);

    @Query(value = "SELECT CASE WHEN SUM(quantity) IS NULL THEN 0 ELSE SUM(quantity) END FROM REFUNDREQUEST WHERE orderitemId = :orderItemId", nativeQuery = true)
    public Integer getReturnedItemQuantityByOrderItemId(@Param(value = "orderItemId") Integer orderItemId);


    @Query(value = """
            select a.*
            from refundrequest a
            left join orderitem oi on a.orderItemId = oi.id
            left join productvariant pv on oi.productVariantId = pv.id
            left join product p on pv.productId = p.id
            where (:keyword is null or :keyword = '' or p.name like concat('%', :keyword, '%'))
              and (:status is null or :status = '' or a.status = :status)
            """, countQuery = """
            select count(*)
            from refundrequest a
            left join orderitem oi on a.orderItemId = oi.id
            left join productvariant pv on oi.productVariantId = pv.id
            left join product p on pv.productId = p.id
            where (:keyword is null or :keyword = '' or p.name like concat('%', :keyword, '%'))
              and (:status is null or a.status = :status)
            """, nativeQuery = true)
    Page<RefundRequest> searchRefundRequest(
            Pageable pageable,
            @Param("status") String status,
            @Param("keyword") String keyword);

    @Query(value = """
            select a.*
            from refundrequest a
            left join orderitem oi on a.orderItemId = oi.id
            left join productvariant pv on oi.productVariantId = pv.id
            left join product p on pv.productId = p.id
            where (:keyword is null or :keyword = '' or p.name like concat('%', :keyword, '%'))
              and (:status is null or :status = '' or a.status = :status)
              and a.userid = :userId
            """, countQuery = """
            select count(*)
            from refundrequest a
            left join orderitem oi on a.orderItemId = oi.id
            left join productvariant pv on oi.productVariantId = pv.id
            left join product p on pv.productId = p.id
            where (:keyword is null or :keyword = '' or p.name like concat('%', :keyword, '%'))
              and (:status is null or a.status = :status)
              and a.userid = :userId
            """, nativeQuery = true)
    Page<RefundRequest> searchRefundRequestByUserId(
            Pageable pageable,
            @Param("status") String status,
            @Param("keyword") String keyword,
            @Param("userId") Integer userId);
}
