package com.example.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.ProductVariant;
import com.example.shop.enums.Size;

import org.springframework.data.repository.query.Param;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
        public Optional<ProductVariant> findByProductIdAndColorIdAndSize(Integer productId, Integer colorId,
                        Size size);

        @Query( value = "SELECT a.* FROM PRODUCTVARIANT a LEFT JOIN PRODUCT b ON a.productId = b.id WHERE b.NAME LIKE CONCAT('%', :keyword, '%') ORDER BY b.name", 
                countQuery = "SELECT COUNT(*) FROM PRODUCTVARIANT a LEFT JOIN PRODUCT b ON a.productId = b.id WHERE b.NAME LIKE CONCAT('%', :keyword, '%') ORDER BY b.name", 
                nativeQuery = true)
        Page<ProductVariant> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

        @Query(value = "SELECT a.* FROM PRODUCTVARIANT a LEFT JOIN ORDERITEM b ON a.id = b.productVariantId WHERE b.id = :orderItemId", nativeQuery = true)
        public Optional<ProductVariant> findByOrderitemId(@Param(value = "orderItemId") Integer orderItemId);

        public List<ProductVariant> findAllByProductId(Integer productId);

}
