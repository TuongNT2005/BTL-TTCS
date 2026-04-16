package com.example.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.RefundRequest;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, Integer> {

    public Page<RefundRequest> findAllByStatus(Pageable pageable, RefundRequest.Status status);

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
}
