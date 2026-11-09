package com.example.shop.dto.projection_interface;

import java.time.LocalDate;

public interface EventProjection {
    Integer getId();
    String getTitle();
    String getDescription();
    String getImage();
    Integer getDiscount();
    LocalDate getStartAt();
    LocalDate getEndAt();
}
