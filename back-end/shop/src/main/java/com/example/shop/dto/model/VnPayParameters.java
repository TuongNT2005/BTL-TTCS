package com.example.shop.dto.model;

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
public class VnPayParameters {
    private String vnp_Amount;
    private final String vnp_BankCode = null;
    private String vnp_TxnRef;
    private final String language = null;

}
