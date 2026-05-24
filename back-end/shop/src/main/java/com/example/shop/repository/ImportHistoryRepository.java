package com.example.shop.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.ImportHistory;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Integer> {
    @Query(value = """
            SELECT sum(price * quantity)
            FROM importhistory 
            WHERE importAt BETWEEN :startAt AND :endAt; 
        """, nativeQuery = true)
    public Long getTotalExpenditure(@Param(value = "startAt") LocalDateTime startAt,
                                    @Param(value = "endAt") LocalDateTime endAt);
    
    @Query(value = """
            with recursive period as (
                select date(:startAt) as date_
                union all
                select date_add(date_, interval 1 month)
                from period
                where date_ < date(:endAt)
            )
            select 
                year(p.date_) as year_, 
                month(p.date_) as month_, 
                coalesce(sum(i.quantity * i.price), 0) as expenditure
            from period p
            left join importhistory i 
                on year(i.importAt) = year(p.date_) 
                and month(i.importAt) = month(p.date_)
                and i.importAt between :startAt and :endAt
            group by year(p.date_), month(p.date_)
            order by year_, month_;
            """, nativeQuery = true)
    public List<Object[]> getExpenditure(@Param(value = "startAt") LocalDateTime startAt,
                                    @Param(value = "endAt") LocalDateTime endAt);
}
