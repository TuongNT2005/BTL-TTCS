package com.example.shop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByUsername(String username);
    public Optional<User> findByUsernameAndPassword(String username, String passoword);
    public Boolean existsByUsername(String username);

    @Query(value = "SELECT * FROM USER WHERE ROLE != 'ADMIN' AND USERNAME LIKE CONCAT('%', :keyword, '%')", nativeQuery = true)
    public Page<User> searchUser(Pageable pageable, @Param(value = "keyword") String keyword);
}
