package com.example.shop.dto.request;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostNewCommentRequest {

    public PostNewCommentRequest() {
    }

    public PostNewCommentRequest(Integer productId, String content, Integer star) {
        this.productId = productId;
        this.content = content;
        this.star = star;
    }

    private Integer productId;

    @NotNull
    @NotBlank
    private String content;

    @Positive
    @Max(value = 5)
    private Integer star;
}
