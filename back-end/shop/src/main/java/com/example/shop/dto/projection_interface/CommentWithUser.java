package com.example.shop.dto.projection_interface;

import java.time.LocalDate;

public interface CommentWithUser {
    String getContent();
    Integer getStar();
    String getUsername();
    String getAvatar();
    LocalDate getCreatedAt();
}
