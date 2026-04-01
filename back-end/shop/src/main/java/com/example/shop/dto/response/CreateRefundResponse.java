package com.example.shop.dto.response;

import com.example.shop.entity.RefundRequest;

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
public class CreateRefundResponse {
    private RefundRequest refundRequest;
}
