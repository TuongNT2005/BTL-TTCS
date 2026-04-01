package com.example.shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query(value = "SELECT e.*\n" + //
            "FROM PRODUCT_EVENT pe\n" + //
            "LEFT JOIN EVENT e ON pe.eventId = e.id\n" + //
            "WHERE pe.productId = 1\n" + //
            "AND e.endAt > NOW();", nativeQuery = true)
    public List<Event> findAllByProductId(@Param("productId") Integer productId);

    public Optional<Event> findByTitleIgnoringCase(String title);
    
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO product_event(productId, eventId) VALUES(:productId, :eventId)", nativeQuery = true)
    public void addProductIntoEvent(@Param("productId") Integer productId, @Param("eventId") Integer eventId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM product_event WHERE productId=:productId AND eventId=:eventId", nativeQuery = true)
    public void deleteProductFromEvent(@Param("productId") Integer productId, @Param("eventId") Integer eventId);
}
