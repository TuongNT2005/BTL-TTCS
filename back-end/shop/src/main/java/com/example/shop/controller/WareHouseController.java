    package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.ImportProductVariantRequest;
import com.example.shop.entity.ProductVariant;
import com.example.shop.service.WareHouseService;

import org.springframework.web.bind.annotation.PostMapping;


@Controller
@RequestMapping("/warehouse")
public class WareHouseController {

    @Autowired private WareHouseService wareHouseService;

    @PostMapping("/import")
    public ResponseEntity<?> importProductVariant(ImportProductVariantRequest request) {
        ProductVariant productVariant = wareHouseService.importProductVariant(request);

        ApiResponse<ProductVariant> response = ApiResponse.<ProductVariant>builder()
            .code(200)
            .message("Nhập kho thành công!")
            .data(productVariant)
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
