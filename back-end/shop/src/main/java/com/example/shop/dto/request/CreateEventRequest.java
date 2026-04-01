package com.example.shop.dto.request;

import java.time.LocalDate;

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
public class CreateEventRequest {
    private String title;
    private String description;
    private Integer discount;
    private String startAt;
    private String endAt;
    private MultipartFile background;
}
