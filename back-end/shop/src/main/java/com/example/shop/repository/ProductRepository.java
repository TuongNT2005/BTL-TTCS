package com.example.shop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.dto.projection_interface.ProductProjection;
import com.example.shop.dto.projection_interface.ProductWithVariantsAndComments;
import com.example.shop.entity.Product;
import com.example.shop.exception.NotFoundException;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    // @Query(value = "SELECT * FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%')", nativeQuery = true)
    // public List<Product> findByKeyword(@Param("keyword") String keyword);

    // @Query(
    //     value = "SELECT * FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%') AND (:category IS NULL OR :category = '' OR CATEGORY = :category) ORDER BY NAME", 
    //     countQuery = "SELECT COUNT(*) FROM PRODUCT WHERE NAME LIKE CONCAT('%',:keyword,'%') AND (:category = '' OR CATEGORY = :category) ORDER BY NAME",
    //     nativeQuery = true)
    // public Page<Product> findByKeyword(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);

    // public Optional<Product> findByNameIgnoreCaseAndCategory(String name, Category category);
    
    // @Query(value = "select productId from product_event where eventId=:eventId", nativeQuery = true)
    // public List<Integer> findAllProductIdByEventId(@Param("eventId") Integer eventId);
    
    // @Query(value = "SELECT p.* FROM PRODUCT_EVENT pe LEFT JOIN PRODUCT p ON pe.productId = p.id WHERE pe.eventId = :eventId", nativeQuery = true)
    // public List<Product> findAllProductByEventId(@Param(value = "eventId") Integer eventId);
    
    // @Query(value = "SELECT a.* FROM PRODUCT a LEFT JOIN PRODUCTVARIANT b on a.id = b.productId LEFT JOIN ORDERITEM c on b.id = c.productVariantId WHERE c.id = :orderItemId", nativeQuery = true)
    // public Optional<Product> findByOrderItemId(@Param(value = "orderItemId") Integer orderItemId);

    // @Query(value = """
    //     select p.id, p.name, p.image, sum(oi.quantity) as 'quantity', sum(oi.quantity * oi.price) as 'income'
    //     from orderitem oi left join
    //     orders o on oi.orderId = o.id left join
    //     productvariant pv on pv.id = oi.productVariantId left join
    //     product p on p.id = pv.productId
    //     where o.createdAt between :startAt and :endAt
    //     group by p.id, p.name, p.image
    //     order by quantity desc, income desc
    //     limit 10
    //         """, nativeQuery = true)
    // public List<Object[]> getTrendProducts(@Param(value = "startAt") LocalDateTime startAt,
    //                                 @Param(value = "endAt") LocalDateTime endAt);

    public default Product findProductById(Integer productId) {
        return findById(productId).orElseThrow(
            () -> new NotFoundException("Sản phẩm với id: " + productId + " không tồn tại!")
        );
    }

    public boolean existsByNameIgnoreCase(String productName);

    public Optional<Product> findByName(String productName);

    public Page<ProductProjection> findBy(Specification<Product> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"productVariants", "productVariants.color", "comments", "comments.user"})
    public Optional<ProductWithVariantsAndComments> findProductWithVariantsAndCommentsById(Integer productId);
}
