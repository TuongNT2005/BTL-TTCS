package com.example.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Color;

@Repository
public interface ColorRepository extends JpaRepository<Color,Integer> {
    public Optional<Color> findByName(String name);
}
