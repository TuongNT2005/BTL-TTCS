package com.example.shop.controller;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.CommentWithUser;
import com.example.shop.dto.request.PostNewCommentRequest;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.repository.CommentRepository;
import com.example.shop.service.AuthService;
import com.example.shop.service.CommentService;

import jakarta.validation.Valid;
@RestController
@RequestMapping({"/products/{productId}/comments", "/product/{productId}/comment", "/products/{productId}/comment"})
public class CommentController {

    private final CommentService commentService;
    private final AuthService authService;
    private final CommentRepository commentRepository;

    public CommentController(CommentService commentService,
                             AuthService authService,
                             CommentRepository commentRepository) {
        this.commentService = commentService;
        this.authService = authService;
        this.commentRepository = commentRepository;
    }

    @PostMapping(value = {"", "/"})
    public ResponseEntity<?> createComment(@PathVariable (name = "productId") Integer productId,
                                          @Valid @RequestBody PostNewCommentRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        if (request.getProductId() == null) {
            request.setProductId(productId);
        }
        commentService.createNewComment(request, userId);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(201)
                .message("Tạo comment mới thành công!")
                .data("Thao tác thành công!")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    /*
        Sắp xếp theo thuộc tinhs: star, createdAt
    */
    @GetMapping("")
    public ResponseEntity<?> getAllCommentByProductId(@PathVariable(name = "productId") Integer productId,
                                                    @RequestParam(required = false, name = "sortBy") List<String> sortCriterias,
                                                    @RequestParam(required = false, name = "sortDir") List<String> sortDirections) {
        
        Sort sort = SortParamExtracter.extractFromParams(sortCriterias, sortDirections);
        List<CommentWithUser> comments = commentRepository.findAllCommentWithUserDtoByProductId(productId, sort);

        ApiResponse<List<CommentWithUser>> response = 
        ApiResponse.<List<CommentWithUser>>builder().code(200)
                                                    .message("Lấy dữ liệu các bình luận thành công!")
                                                    .data(comments)
                                                    .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
