package com.example.shop.dto.response;

import java.time.LocalDateTime;

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
public class CancelOrderResponse {

    private Integer id;
    private LocalDateTime createdAt;
    private LocalDateTime expriredat;
    private String status;
}
