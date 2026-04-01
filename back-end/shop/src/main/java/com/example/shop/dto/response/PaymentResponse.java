package com.example.shop.dto.response;

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
public class PaymentResponse {
    private String totalAmout;
    private String bankInfor;
    private String cardType;
    private String payDate;
    private String message;
    private String status;
    private String orderId;
    private String transactionNo;

}
