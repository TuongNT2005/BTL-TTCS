package com.example.shop.dto.projection_interface;

import java.time.LocalDate;
import java.util.Set;


public interface EventWithAppliedProducts {
    Integer getId();
    String getTitle();
    String getDescription();
    String getImage();
    Integer getDiscount();
    LocalDate getStartAt();
    LocalDate getEndAt();
    Set<DiscountedProductOfEvent> getDiscountedProducts();
}

interface DiscountedProductOfEvent {
    Integer getId();
    String getName();
}
