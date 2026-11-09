package com.example.shop.dto.request;

import com.example.shop.enums.Category;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNewProductRequest {
    
    public CreateNewProductRequest() {
    }

    public CreateNewProductRequest(String productName, String description, String imageUrl, String category) {
        this.productName = productName;
        this.description = description;
        this.imageUrl = (imageUrl != null) ? imageUrl : "";
        this.category = category;
    }
    
    @NotBlank(message = "Tên sản phẩm không được bỏ trống!")
    private String productName;

    @NotBlank(message = "Mô tả sản phẩm không được bỏ trống!")
    private String description;

    private String imageUrl = "";

    @NotBlank(message = "Thể loại sản phẩm không được bỏ trống!")
    private String category;

    @AssertTrue(message = "Thể loại không khớp!")
    public boolean isCategoryMatched() {
        try {
            Category.valueOf(category);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
