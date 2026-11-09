package com.example.shop.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.ProductVariantProjection;
import com.example.shop.dto.request.ImportVariantRequest;
import com.example.shop.dto.request.UpdateVariantRequest;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.service.ProductVariantService;

import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
@RestController
@RequestMapping({"/product-variants", "/variant"})
public class ProductVariantController {
    private final ProductVariantService productVariantService;

    public ProductVariantController(ProductVariantService productVariantService) {
        this.productVariantService = productVariantService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> insertOrUpdateVariant(@Valid @RequestBody ImportVariantRequest request,
                                                   @RequestParam(name = "productId") Integer productId) {
        productVariantService.insertOrUpdateVariant(request, productId);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Thao tác thành công!")
                .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("")
    public ResponseEntity<?> searchVariants(
            @RequestParam(required = false, name = "productName", defaultValue = "") String productName,
            @RequestParam(required = false, name = "color", defaultValue = "") String color,
            @RequestParam(required = false, name = "size", defaultValue = "") String size,
            @RequestParam(required = false, name = "status", defaultValue = "") String status,
            @RequestParam(required = false, name = "productId") Integer productId,
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size") Integer sizeParam,
            @RequestParam(required = false, name = "pageSize") Integer pageSize,
            @RequestParam(required = false, name = "sortBy") List<String> sortCriterias,
            @RequestParam(required = false, name = "sortDir") List<String> sortDirections) {

        int limit = sizeParam != null ? sizeParam : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);
        Sort sort = SortParamExtracter.extractFromParams(sortCriterias, sortDirections);
        Page<ProductVariantProjection> data = productVariantService.findVariants(
                PageRequest.of(safePage, limit, sort), productName, color, size, status, productId);

        ApiResponse<Page<ProductVariantProjection>> response = ApiResponse.<Page<ProductVariantProjection>>builder()
                .code(200)
                .message("Lấy danh sách biến thể thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVariantById(@PathVariable(name = "id") Integer id) {
        ProductVariantProjection data = productVariantService.findVariantById(id);

        ApiResponse<ProductVariantProjection> response = ApiResponse.<ProductVariantProjection>builder()
                .code(200)
                .message("Lấy thông tin biến thể thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVariant(@PathVariable(name = "id") Integer id,
                                          @Valid @RequestBody UpdateVariantRequest request) {
        productVariantService.updateExistingVariant(request, id);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Cập nhật biến thể thành công!")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

