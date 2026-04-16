package com.example.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Color;

@Repository
public interface ColorRepository extends JpaRepository<Color,Integer> {
    public Optional<Color> findByName(String name);

    @Query(value = "SELECT NAME FROM COLOR WHERE ID = :colorId", nativeQuery = true)
    public Optional<String> findNameById(@Param(value = "colorId") Integer colorId);
}
