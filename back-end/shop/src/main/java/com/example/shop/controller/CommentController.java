package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateNewCommentRequest;
import com.example.shop.dto.response.CreateNewCommentResponse;
import com.example.shop.entity.Comment;
import com.example.shop.service.CommentService;


@Controller
@RequestMapping("/comment")
public class CommentController {

    @Autowired private CommentService commentService;

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<?> postMethodName(CreateNewCommentRequest request) {
        
        try {
            Comment newComment = commentService.createNewComment(request);
            ApiResponse<CreateNewCommentResponse> response  = ApiResponse.<CreateNewCommentResponse>builder()
                .code(200)
                .message("Tạo comment mới thành công!")
                .data(new CreateNewCommentResponse(newComment))
                .build();
            
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    
}
