package com.example.shop.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Product;
import com.example.shop.enums.Category;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query(value = "SELECT * FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%')", nativeQuery = true)
    public List<Product> findByKeyword(@Param("keyword") String keyword);

    @Query(
        value = "SELECT * FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%') AND (:category IS NULL OR :category = '' OR CATEGORY = :category) ORDER BY NAME", 
        countQuery = "SELECT COUNT(*) FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%') AND (:category = '' OR CATEGORY = :category) ORDER BY NAME",
        nativeQuery = true)
    public Page<Product> findByKeyword(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);

    public Optional<Product> findByNameIgnoreCaseAndCategory(String name, Category category);
    
    @Query(value = "select productId from product_event where eventId=:eventId", nativeQuery = true)
    public List<Integer> findAllProductIdByEventId(@Param("eventId") Integer eventId);
    
    @Query(value = "SELECT p.* FROM PRODUCT_EVENT pe LEFT JOIN PRODUCT p ON pe.productId = p.id WHERE pe.eventId = :eventId", nativeQuery = true)
    public List<Product> findAllProductByEventId(@Param(value = "eventId") Integer eventId);
    
    @Query(value = "SELECT a.* FROM PRODUCT a LEFT JOIN PRODUCTVARIANT b on a.id = b.productId LEFT JOIN ORDERITEM c on b.id = c.productVariantId WHERE c.id = :orderItemId", nativeQuery = true)
    public Optional<Product> findByOrderItemId(@Param(value = "orderItemId") Integer orderItemId);

    @Query(value = """
        select p.id, p.name, p.image, sum(oi.quantity) as 'quantity', sum(oi.quantity * oi.price) as 'income'
        from orderitem oi left join
        orders o on oi.orderId = o.id left join
        productvariant pv on pv.id = oi.productVariantId left join
        product p on p.id = pv.productId
        where o.createdAt between :startAt and :endAt
        group by p.id, p.name, p.image
        order by quantity desc, income desc
        limit 10
            """, nativeQuery = true)
    public List<Object[]> getTrendProducts(@Param(value = "startAt") LocalDateTime startAt,
                                    @Param(value = "endAt") LocalDateTime endAt);
}
