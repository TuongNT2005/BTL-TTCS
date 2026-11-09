package com.example.shop.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.dto.projection_interface.CommentWithUser;
import com.example.shop.entity.Comment;


public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Query("""
            SELECT c.content as content, c.star as star, u.username as username, u.avatar as avatar, c.createdAt as createdAt
            FROM Comment c 
            JOIN c.user u 
            JOIN c.product p 
            WHERE p.id = :productId
            """)
    public List<CommentWithUser> findAllCommentWithUserDtoByProductId(@Param(value = "productId") Integer productId, Sort sort); 

    // @Query(value = "select star, count(*) from comment group by star", nativeQuery = true)
    // public List<Object[]> getStarCount();
}
