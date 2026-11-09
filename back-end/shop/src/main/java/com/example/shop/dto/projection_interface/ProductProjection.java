package com.example.shop.dto.projection_interface;

import com.example.shop.enums.Category;

public interface ProductProjection {
    Integer getId();
    String getName();
    String getImage();
    Category getCategory();

}
