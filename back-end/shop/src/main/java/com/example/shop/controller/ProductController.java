package com.example.shop.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.ProductProjection;
import com.example.shop.dto.projection_interface.ProductWithVariantsAndComments;
import com.example.shop.dto.request.CreateNewProductRequest;
import com.example.shop.dto.request.UpdateProductRequest;
import com.example.shop.entity.Product;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/products", "/product"})
public class ProductController {

        private final ProductService productService;

        public ProductController(ProductService productService) {
            this.productService = productService;
        }

        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping("")
        public ResponseEntity<?> createNewProduct(@Valid @RequestBody CreateNewProductRequest request) {
            Product product = productService.createNewProduct(request);

            ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                                                        .code(201)
                                                        .message("Thao tác thành công!")
                                                        .data(product.getId())
                                                        .build();

            return ResponseEntity.status(HttpStatus.CREATED)
                    .location(java.net.URI.create("/products/" + product.getId()))
                    .body(response);
        }
        
        @PreAuthorize("hasRole('ADMIN')")
        @PutMapping("/{productId}")
        public ResponseEntity<?> updateProduct(@PathVariable(name = "productId") Integer productId, 
                                    @RequestBody UpdateProductRequest request) {
            productService.updateProduct(request, productId);

            ApiResponse<String> response = ApiResponse.<String>builder()
                                                        .code(200)
                                                        .message("Thao tác thành công!")
                                                        .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        
        }

        /*
            Query:
            - name
            - category

            Sort:
            - name
            - id
        
        */
        @GetMapping("")
        public ResponseEntity<?> searchProducts(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                            @RequestParam(required = false, name = "size") Integer size,
                            @RequestParam(required = false, name = "pageSize") Integer pageSize,
                            @RequestParam(required = false, name = "productName", defaultValue = "") String productName,
                            @RequestParam(required = false, name = "category", defaultValue = "") String category,
                            @RequestParam(required = false, name = "sortBy") List<String> sortCriterias,
                            @RequestParam(required = false, name = "sortDir") List<String> sortDirections) {

            int limit = size != null ? size : (pageSize != null ? pageSize : 10);
            int safePage = Math.max(0, (page != null ? page : 1) - 1);
            Sort sort = SortParamExtracter.extractFromParams(sortCriterias, sortDirections);
            Page<ProductProjection> data = productService.findProducts(PageRequest.of(safePage, limit, sort), productName, category);
            
            ApiResponse<Page<ProductProjection>> response = ApiResponse.<Page<ProductProjection>>builder()
                                                        .code(200)
                                                        .message("Thao tác thành công!")
                                                        .data(data)
                                                        .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        // Backward compatibility method alias
        public ResponseEntity<?> serachProducts(Integer page, Integer size, String productName, String category,
                                                List<String> sortCriterias, List<String> sortDirections) {
            return searchProducts(page, size, null, productName, category, sortCriterias, sortDirections);
        }

        @GetMapping({"/{productId}", "/{productId}/detail"})
        public ResponseEntity<?> getProductDetail(@PathVariable(name = "productId") Integer productId) {
            ProductWithVariantsAndComments productWithVariantsAndComments = productService.findById(productId);

            ApiResponse<ProductWithVariantsAndComments> response = ApiResponse.<ProductWithVariantsAndComments>builder()
                                                        .code(200)
                                                        .message("Thao tác thành công!")
                                                        .data(productWithVariantsAndComments)
                                                        .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
}

