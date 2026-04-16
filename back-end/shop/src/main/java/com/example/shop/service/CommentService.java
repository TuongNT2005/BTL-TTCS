package com.example.shop.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateNewCommentRequest;
import com.example.shop.entity.Comment;
import com.example.shop.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired private CommentRepository commentRepository;

    public Comment createNewComment(CreateNewCommentRequest request) {
        try {
            
        Integer userId = request.getUserId();

        Comment comment = Comment.builder()
            .createdAt(LocalDate.now())
            .productId(request.getProductId())  
            .content(request.getContent())
            .star(request.getStar())
            .userId(userId)
            .build();

        commentRepository.save(comment);

        return comment;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Comment> getAllCommentsByProductId(Integer ProductId) {
        try {
            return commentRepository.findAllByProductId(ProductId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
