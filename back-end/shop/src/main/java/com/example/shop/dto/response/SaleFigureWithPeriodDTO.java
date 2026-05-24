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
public class SaleFigureWithPeriodDTO {
    private String period;
    private Long income;
    private Long expenditure;
    private Long profit;
}
