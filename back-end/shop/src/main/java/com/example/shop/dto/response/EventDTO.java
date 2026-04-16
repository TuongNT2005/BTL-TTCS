package com.example.shop.dto.response;

import java.time.LocalDate;

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
public class EventDTO {

    private Integer id;
    private String title;
    private String image;
    private Integer discount;
    private LocalDate startAt;
    private LocalDate endAt;
    private String description;
}
