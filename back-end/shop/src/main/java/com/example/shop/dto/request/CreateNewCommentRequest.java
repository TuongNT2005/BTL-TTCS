package com.example.shop.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateNewCommentRequest {
    private Integer userId;
    private String content;
    private Integer star;
    private MultipartFile file;
    private Integer productId;
}
