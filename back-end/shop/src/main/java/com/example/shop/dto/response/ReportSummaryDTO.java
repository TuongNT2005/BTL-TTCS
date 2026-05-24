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
public class ReportSummaryDTO {
    Long totalProducts;
    Long totalProductVariants;
    Long totalUsers;
    Long totalUndeliveriedOrders;
    Long totalUnhandledRefundRequests;
    Long totalAvalibleEvents;
    Long totalExpenditure;
    Long totalIncome;
    Long totalProfit;
}
