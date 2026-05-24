package com.example.shop.mapper;

import org.springframework.stereotype.Component;

import com.example.shop.dto.response.SaleFigureWithPeriodDTO;
import com.example.shop.dto.response.SaleWithCategoryDTO;
import com.example.shop.dto.response.StarCountDTO;
import com.example.shop.dto.response.TopSpedingUserDTO;
import com.example.shop.dto.response.TrendProductDTO;

@Component
public class ReportMapper {

    public SaleWithCategoryDTO toSaleWithCategoryDTO(Object[] row) {
        String category = (String) row[0];
        Long totalIncome = ((Number) row[1]).longValue();
        return SaleWithCategoryDTO.builder()
            .category(category)
            .totalIncome(totalIncome)
            .build();
    }

    public StarCountDTO toStarCountDTO(Object[] row) {
        Integer star = ((Number) row[0]).intValue();
        Integer count = ((Number) row[1]).intValue();
        return StarCountDTO.builder()
            .star(star)
            .count(count)
            .build();
    }

    public SaleFigureWithPeriodDTO toSaleFigureWithPeriodDTO(Object[] row1, Object[] row2) {
        Integer year = ((Number) row1[0]).intValue();
        Integer month = ((Number) row1[1]).intValue();
        Long income = ((Number) row1[2]).longValue();
        Long expenditure = ((Number) row2[2]).longValue();
        return SaleFigureWithPeriodDTO.builder()
            .period(String.format("T%d/%d", month, year))
            .expenditure(expenditure)
            .income(income)
            .profit(income - expenditure)
            .build();
    }

    public TrendProductDTO toTrendProductDTO(Object[] row) {
        Integer id = ((Number) row[0]).intValue();
        String name = (String) row[1];
        String image = (String) row[2];
        Integer quantity = ((Number) row[3]).intValue();
        Long income = ((Number) row[4]).longValue();

        return TrendProductDTO.builder()
            .id(id)
            .name(name)
            .image(image)
            .quantity(quantity)
            .income(income)
            .build();
    }

    public TopSpedingUserDTO toTopSpedingUserDTO(Object[] row) {
        Integer id = ((Number) row[0]).intValue();
        String email = (String) row[1];
        String image = (String) row[2];
        Integer boughtProducts = ((Number) row[3]).intValue();
        Long totalSpeding = ((Number) row[4]).longValue();

        return TopSpedingUserDTO.builder()
            .id(id)
            .email(email)
            .image(image)
            .totalSpending(totalSpeding)
            .boughtProducts(boughtProducts)
            .build();
    }

}
