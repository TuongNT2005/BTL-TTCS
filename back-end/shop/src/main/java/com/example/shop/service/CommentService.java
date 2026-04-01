package com.example.shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateNewCommentRequest;
import com.example.shop.entity.Comment;
import com.example.shop.repository.CommentRepository;
import com.example.shop.util.FileUtil;

@Service
public class CommentService {

    @Autowired private AuthService authService;
    @Autowired private CommentRepository commentRepository;

    public Comment createNewComment(CreateNewCommentRequest request) {
        
        Integer userId = authService.getAuthenticatedUserId();
        String fileName = FileUtil.saveFileToDir(request.getFile(), "comment", FileUtil.genFileName("comment_"));

        Comment comment = Comment.builder()
            .image(fileName)
            .productId(request.getProductId())
            .content(request.getContent())
            .star(request.getStar())
            .userId(userId)
            .build();

        commentRepository.save(comment);

        return comment;
    }
}
