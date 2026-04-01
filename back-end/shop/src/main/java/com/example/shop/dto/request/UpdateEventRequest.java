package com.example.shop.dto.request;

import java.util.List;

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
public class UpdateEventRequest {
    private Integer id;
    private String title;
    private String description;
    private MultipartFile background;
    private Integer discount;
    private List<Integer> discountedProductIds;
    private String startAt;
    private String endAt;
}
