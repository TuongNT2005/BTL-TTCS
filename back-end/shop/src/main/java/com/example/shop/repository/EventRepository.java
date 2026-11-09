package com.example.shop.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.dto.projection_interface.EventProjection;
import com.example.shop.dto.projection_interface.EventWithAppliedProducts;
import com.example.shop.dto.projection_interface.ProductWithDiscount;
import com.example.shop.entity.Event;
import com.example.shop.exception.NotFoundException;
import java.util.Set;


public interface EventRepository extends JpaRepository<Event, Integer>, JpaSpecificationExecutor<Event> {

        public Optional<Event> findByTitleIgnoreCase(String title);

        public default Event findEventById(Integer id) {
                return findById(id).orElseThrow(
                        () -> new NotFoundException("Sự kiện với id " + id + " không tồn tại!")
                );
        }

        public Boolean existsByTitleIgnoreCase(String title);
        
        @Query("""
            SELECT p.id as productId,
                   CASE
                       WHEN COALESCE(SUM(e.discount), 0) > 30 THEN 30
                       ELSE COALESCE(SUM(e.discount), 0)
                   END as discount,
                   p.name as name
            FROM Product p
            LEFT JOIN p.events e
                   ON e.startAt <= CURRENT_TIMESTAMP
                  AND e.endAt >= CURRENT_TIMESTAMP
            WHERE p.id IN :productIds
            GROUP BY p.id
            """)
        Set<ProductWithDiscount> findDiscountByProductId(
                @Param("productIds") Collection<Integer> productIds);

        public Page<EventProjection> findBy(Specification<Event> spec, Pageable pageable);
        
        @EntityGraph(attributePaths = {"discountedProducts"})
        Optional<EventWithAppliedProducts> findEventWithAppliedProductsById(Integer eventId);
        
//     @Query(value = "SELECT e.*\n" + //
//             "FROM PRODUCT_EVENT pe\n" + //
//             "LEFT JOIN EVENT e ON pe.eventId = e.id\n" + //
//             "WHERE pe.productId = :productId\n" + //
//             "AND e.endAt >= NOW() AND e.startAt <= NOW();", nativeQuery = true)
//     public List<Event> findAllByProductId(@Param("productId") Integer productId);

//     public Optional<Event> findByTitleIgnoringCase(String title);
    
//     @Modifying
//     @Transactional
//     @Query(value = "INSERT INTO product_event(productId, eventId) VALUES(:productId, :eventId)", nativeQuery = true)
//     public void addProductIntoEvent(@Param("productId") Integer productId, @Param("eventId") Integer eventId);

//     @Modifying
//     @Transactional
//     @Query(value = "DELETE FROM product_event WHERE productId=:productId AND eventId=:eventId", nativeQuery = true)
//     public void deleteProductFromEvent(@Param("productId") Integer productId, @Param("eventId") Integer eventId);

//     @Query( value = "SELECT * FROM EVENT WHERE TITLE LIKE CONCAT('%', :keyword, '%') AND  ((:startAt IS NULL OR ENDAT >= :startAt) AND (:endAt IS NULL OR STARTAT <= :endAt))",
//             countQuery = "SELECT COUNT(*) FROM EVENT WHERE TITLE LIKE CONCAT('%', :keyword, '%') AND  ((:startAt IS NULL OR ENDAT >= :startAt) AND (:endAt IS NULL OR STARTAT <= :endAt))",
//             nativeQuery = true)
//     public Page<Event> findAllEvents(Pageable pageable, @Param(value = "keyword") String keyword,
//                                                         @Param(value = "startAt") LocalDate startAt,
//                                                         @Param(value = "endAt") LocalDate endAt
                                                        
//     );

//     public Long countByStartAtLessThanEqualAndEndAtGreaterThanEqual(LocalDate endTime, LocalDate startTime);
}
