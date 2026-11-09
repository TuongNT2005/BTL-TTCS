package com.example.shop.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.shop.dto.projection_interface.CommentWithUser;
import com.example.shop.dto.request.PostNewCommentRequest;
import com.example.shop.entity.Comment;
import com.example.shop.entity.Product;
import com.example.shop.entity.User;
import com.example.shop.repository.CommentRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public void createNewComment(PostNewCommentRequest request, Integer userId) {

        Product product = productRepository.findProductById(request.getProductId());
        User user = userRepository.findUserById(userId);

        Comment comment = Comment.builder()
            .createdAt(LocalDate.now())
            .product(product)  
            .content(request.getContent())
            .star(request.getStar())
            .user(user)
            .build();

        commentRepository.save(comment);

    }

    public List<CommentWithUser> getCommentsByProductsId(Integer productId, Sort sort) {
        return commentRepository.findAllCommentWithUserDtoByProductId(productId, sort);
    }
}
