package com.example.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shop.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    public List<Comment> findAllByProductId(Integer productId); 
}
