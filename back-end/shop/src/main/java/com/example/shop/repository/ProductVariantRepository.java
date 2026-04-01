package com.example.shop.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import com.example.shop.entity.ProductVariant;
import org.springframework.data.repository.query.Param;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    public Optional<ProductVariant> findByProductIdAndColorIdAndSize(Integer productId, Integer colorId,
            ProductVariant.Size size);

    @Query(value = "SELECT a.* FROM PRODUCTVARIANT a LEFT JOIN PRODUCT b ON a.productId = b.id WHERE b.NAME LIKE CONCAT('%',:keyword,'%')", 
            countQuery = "SELECT COUNT(*) FROM PRODUCTVARIANT a LEFT JOIN PRODUCT b ON a.productId = b.id WHERE b.NAME LIKE CONCAT('%',:keyword,'%')", nativeQuery = true)
    public Page<ProductVariant> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
