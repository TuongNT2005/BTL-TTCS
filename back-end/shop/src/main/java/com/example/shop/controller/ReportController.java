package com.example.shop.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.response.ReportSummaryDTO;
import com.example.shop.dto.response.SaleFigureWithPeriodDTO;
import com.example.shop.dto.response.SaleWithCategoryDTO;
import com.example.shop.dto.response.StarCountDTO;
import com.example.shop.dto.response.TopSpedingUserDTO;
import com.example.shop.dto.response.TrendProductDTO;
import com.example.shop.mapper.ReportMapper;
import com.example.shop.service.ReportService;
import com.example.shop.util.Converter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/report")
public class ReportController {
    @Autowired private ReportService reportService;
    @Autowired private ReportMapper reportMapper;

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam(name = "startAt") String startAt, @RequestParam(name = "endAt") String endAt) {
        // dd/MM/yyyy" -> LocalDateTime
        LocalDateTime startAt_ = Converter.StringToLocalDateTime(startAt + " 00:00:00"); 
        LocalDateTime endAt_ = Converter.StringToLocalDateTime(endAt + " 23:59:59"); 
        LocalDate startAt__ = Converter.StringToLocalDate(startAt);
        LocalDate endAt__ = Converter.StringToLocalDate(endAt);
        
        Long totalProducts = reportService.countTotalProducts();
        Long totalProductVariants = reportService.countTotalProductVariants();
        Long totalUsers = reportService.countTotalUsers();
        Long totalUndeliveriedOrders = reportService.getTotalUndeliveriedOrders(startAt_, endAt_);
        Long totalIncome = reportService.getTotalIncome(startAt_, endAt_);
        Long totalUnhandledRefundRequests = reportService.getTotalUnhandledRefundRequests(startAt_, endAt_);
        Long totalAvalibleEvents = reportService.getTotalAvalibleEvents(startAt__, endAt__);
        Long totalExpenditure = reportService.getTotalExpenditure(startAt_, endAt_);
        Long totalProfit = totalIncome - totalExpenditure;

        ReportSummaryDTO data = ReportSummaryDTO.builder()
                                .totalAvalibleEvents(totalAvalibleEvents)
                                .totalExpenditure(totalExpenditure)
                                .totalIncome(totalIncome)
                                .totalProductVariants(totalProductVariants)
                                .totalProducts(totalProducts)
                                .totalProfit(totalProfit)
                                .totalUndeliveriedOrders(totalUndeliveriedOrders)
                                .totalUnhandledRefundRequests(totalUnhandledRefundRequests)
                                .totalUsers(totalUsers)
                                .build();

        ApiResponse<ReportSummaryDTO> response = ApiResponse.<ReportSummaryDTO>builder()
                                                    .code(200)
                                                    .message("Lấy dữ liệu thành công!")
                                                    .data(data)
                                                    .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/sale-with-category")
    public ResponseEntity<?> getSaleWithCategory(@RequestParam(name = "startAt") String startAt, @RequestParam(name = "endAt") String endAt) {
        LocalDateTime startAt_ = Converter.StringToLocalDateTime(startAt + " 00:00:00"); 
        LocalDateTime endAt_ = Converter.StringToLocalDateTime(endAt + " 23:59:59"); 
        
        List<Object[]> data = reportService.getSaleWithCategories(startAt_, endAt_);
        List<SaleWithCategoryDTO> dtos = data.stream().map((d) -> reportMapper.toSaleWithCategoryDTO(d)).toList();

        ApiResponse<List<SaleWithCategoryDTO>> response = ApiResponse.<List<SaleWithCategoryDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(dtos)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/star-count")
    public ResponseEntity<?> getStarCount() {

        List<Object[]> data = reportService.getStarCount();
        List<StarCountDTO> dtos = data.stream().map((d) -> reportMapper.toStarCountDTO(d)).toList();

        ApiResponse<List<StarCountDTO>> response = ApiResponse.<List<StarCountDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(dtos)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/sale-figure")
    public ResponseEntity<?> getSaleFigure(@RequestParam(name = "startAt") String startAt, @RequestParam(name = "endAt") String endAt) {
        LocalDateTime startAt_ = Converter.StringToLocalDateTime(startAt + " 00:00:00"); 
        LocalDateTime endAt_ = Converter.StringToLocalDateTime(endAt + " 23:59:59"); 
        List<Object[]> incomes = reportService.getIncomeFigureWithPeriod(startAt_, endAt_);
        List<Object[]> expenditure = reportService.getExpenditureWithPeriod(startAt_, endAt_);

        List<SaleFigureWithPeriodDTO> data = new ArrayList<>();
        for(int i = 0; i < incomes.size(); i++) {
            data.add(reportMapper.toSaleFigureWithPeriodDTO(incomes.get(i), expenditure.get(i)));
        }

        ApiResponse<List<SaleFigureWithPeriodDTO>> response = ApiResponse.<List<SaleFigureWithPeriodDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(data)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/trend-products")
    public ResponseEntity<?> geTrendProducts(@RequestParam(name = "startAt") String startAt, @RequestParam(name = "endAt") String endAt) {
        LocalDateTime startAt_ = Converter.StringToLocalDateTime(startAt + " 00:00:00"); 
        LocalDateTime endAt_ = Converter.StringToLocalDateTime(endAt + " 23:59:59"); 
        List<Object[]> trendProducts = reportService.getTrendProducts(startAt_, endAt_);

        List<TrendProductDTO> data = trendProducts.stream().map((trendProduct) -> reportMapper.toTrendProductDTO(trendProduct)).toList();

        ApiResponse<List<TrendProductDTO>> response = ApiResponse.<List<TrendProductDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(data)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/top-spending")
    public ResponseEntity<?> geTopSpendingUsers(@RequestParam(name = "startAt") String startAt, @RequestParam(name = "endAt") String endAt) {
        LocalDateTime startAt_ = Converter.StringToLocalDateTime(startAt + " 00:00:00"); 
        LocalDateTime endAt_ = Converter.StringToLocalDateTime(endAt + " 23:59:59"); 
        List<Object[]> topSpendingUsers = reportService.getTopSpendingUsers(startAt_, endAt_);

        List<TopSpedingUserDTO> data = topSpendingUsers.stream().map((trendProduct) -> reportMapper.toTopSpedingUserDTO(trendProduct)).toList();

        ApiResponse<List<TopSpedingUserDTO>> response = ApiResponse.<List<TopSpedingUserDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(data)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
