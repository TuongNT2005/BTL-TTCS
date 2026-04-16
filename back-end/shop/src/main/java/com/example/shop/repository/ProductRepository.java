package com.example.shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query(value = "SELECT * FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%')", nativeQuery = true)
    public List<Product> findByKeyword(@Param("keyword") String keyword);

    @Query(
        value = "SELECT * FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%')", 
        countQuery = "SELECT COUNT(*) FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%')",
        nativeQuery = true)
    public Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    public Optional<Product> findByNameIgnoreCaseAndCategory(String name, Product.Category category);
    
    @Query(value = "select productId from product_event where eventId=:eventId", nativeQuery = true)
    public List<Integer> findAllProductIdByEventId(@Param("eventId") Integer eventId);
    
    @Query(value = "SELECT p.* FROM PRODUCT_EVENT pe LEFT JOIN PRODUCT p ON pe.productId = p.id WHERE pe.eventId = :eventId", nativeQuery = true)
    public List<Product> findAllProductByEventId(@Param(value = "eventId") Integer eventId);
    
    @Query(value = "SELECT a.* FROM PRODUCT a LEFT JOIN PRODUCTVARIANT b on a.id = b.productId LEFT JOIN ORDERITEM c on b.id = c.productVariantId WHERE c.id = :orderItemId", nativeQuery = true)
    public Optional<Product> findByOrderItemId(@Param(value = "orderItemId") Integer orderItemId);
}
