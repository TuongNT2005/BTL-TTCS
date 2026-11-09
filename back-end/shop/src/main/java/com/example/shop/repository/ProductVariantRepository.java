package com.example.shop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.shop.dto.projection_interface.ProductVariantProjection;
import com.example.shop.entity.ProductVariant;
import com.example.shop.enums.Size;
import com.example.shop.exception.NotFoundException;

import jakarta.persistence.LockModeType;

import org.springframework.data.repository.query.Param;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer>, JpaSpecificationExecutor<ProductVariant> {

        public Page<ProductVariantProjection> findBy(Specification<ProductVariant> spec, Pageable pageable);

        @EntityGraph(attributePaths = {"product", "color"})
        public Optional<ProductVariantProjection> findVariantProjectedById(Integer variantId);

        @Query("""
                SELECT pv
                FROM ProductVariant pv
                JOIN pv.color o
                JOIN pv.product p
                WHERE p.id = :productId AND o.name = :colorName AND pv.size = :size
                        """)
        public Optional<ProductVariant> findByProductIdAndColoAndSize(@Param(value = "productId") Integer productId, 
                                                                      @Param(value = "colorName") String colorName,
                                                                      @Param(value = "size") Size size);
        
        @Modifying
        @Query("""
                UPDATE ProductVariant pv
                SET pv.quantity = pv.quantity + :quantity
                WHERE pv.id = :productVariantId        
                        """)
        public Integer increaseStock(@Param(value = "productVariantId") Integer productVariantId,
                                            @Param(value = "quantity") Integer quantity);

        // @Query( value = "SELECT a.* FROM PRODUCTVARIANT a LEFT JOIN PRODUCT b ON a.productId = b.id WHERE b.NAME LIKE CONCAT('%', :keyword, '%') ORDER BY b.name", 
        //         countQuery = "SELECT COUNT(*) FROM PRODUCTVARIANT a LEFT JOIN PRODUCT b ON a.productId = b.id WHERE b.NAME LIKE CONCAT('%', :keyword, '%') ORDER BY b.name", 
        //         nativeQuery = true)
        // Page<ProductVariant> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

        // @Query(value = "SELECT a.* FROM PRODUCTVARIANT a LEFT JOIN ORDERITEM b ON a.id = b.productVariantId WHERE b.id = :orderItemId", nativeQuery = true)
        // public Optional<ProductVariant> findByOrderitemId(@Param(value = "orderItemId") Integer orderItemId);

        // public List<ProductVariant> findAllByProductId(Integer productId);

        public default ProductVariant findProductVariantById(Integer productVariantId) {
                return findById(productVariantId).orElseThrow(
                        () -> new NotFoundException("Biến thể với id: " + productVariantId + " không tồn tại!")
                );
        }

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("""
                SELECT pv FROM ProductVariant pv WHERE pv.id = :variantId
                        """)
        public Optional<ProductVariant> findVariantByIdWithPresLock(@Param(value = "variantId") Integer variantId);

        @Modifying
        @Query("""
                UPDATE ProductVariant pv
                SET pv.quantity = pv.quantity - :quantity
                WHERE pv.id = :productVariantId AND pv.quantity >= :quantity
                        """)
        public Integer decreseStock(    @Param(value = "productVariantId") Integer productVariantId,
                                        @Param(value = "quantity") Integer quantity);
        

}
