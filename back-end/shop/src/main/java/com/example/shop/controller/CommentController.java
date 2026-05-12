package com.example.shop.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateNewCommentRequest;
import com.example.shop.dto.response.CommentDTO;
import com.example.shop.dto.response.CreateNewCommentResponse;
import com.example.shop.entity.Comment;
import com.example.shop.entity.User;
import com.example.shop.service.AuthService;
import com.example.shop.service.CommentService;
import com.example.shop.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@Controller
@RequestMapping("/comment")
public class CommentController {

    @Autowired private CommentService commentService;
    @Autowired private UserService userService;
    @Autowired private AuthService authService;

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<?> postMethodName(CreateNewCommentRequest request) {
        
        try {
            Integer userId = authService.getAuthenticatedUserId();
            Comment newComment = commentService.createNewComment(request, userId);
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

    @GetMapping("/{productId}")
    public ResponseEntity<?> getAllCommentByProductId(@PathVariable(name = "productId") Integer productId) {

        List<Comment> comments = commentService.getAllCommentsByProductId(productId);
        List<CommentDTO> commentDTOs = new ArrayList<>();
        for(Comment comment : comments) {
            User user = userService.findUserById(comment.getUserId());
            commentDTOs.add(new CommentDTO(userService.convertToUserDTO(user), comment));
        }

        ApiResponse<List<CommentDTO>> response = ApiResponse.<List<CommentDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu các bình luận thành công!")
            .data(commentDTOs)
            .build(); 

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    
}
