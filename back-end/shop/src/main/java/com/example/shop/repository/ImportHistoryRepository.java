package com.example.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.ImportHistory;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Integer> {

}
