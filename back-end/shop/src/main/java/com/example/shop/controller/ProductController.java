package com.example.shop.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateProductRequest;
import com.example.shop.dto.request.UpdateProductRequest;
import com.example.shop.dto.response.CreateProductResponse;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.service.ProductService;
import com.example.shop.util.ConstantVal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Product>>> searchProduct(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page") Integer page) {

        Page<Product> products = productService.searchProduct(
                keyword,
                PageRequest.of(page - 1, ConstantVal.itemPerPage));

        ApiResponse<Page<Product>> response = ApiResponse.<Page<Product>>builder()
                .code(200)
                .message("Lấy dữ liệu thành công!")
                .data(products)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewProduct(CreateProductRequest request) {
        Product product = productService.createNewProduct(request);

        ApiResponse<CreateProductResponse> response = ApiResponse.<CreateProductResponse>builder()
                .code(200)
                .message("Thêm sản phẩm mới thành công!")
                .data(CreateProductResponse.builder().product(product).build())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProduct(UpdateProductRequest request) {
        Product updatedProduct = productService.updateProduct(request);
        ApiResponse<Product> response = ApiResponse.<Product>builder()
                .code(200)
                .message("Cập nhập thông tin sản phẩm thành công!")
                .data(updatedProduct)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        ApiResponse<List<Product>> response = ApiResponse.<List<Product>>builder()
                .code(200)
                .message("Lấy thông tin sản phẩm thành công!")
                .data(products)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable(name = "id") Integer id) {

        Product product = productService.findProductById(id);

        Map<String, Object> data = new TreeMap<String, Object>();
        data.put("product", product);
        data.put("categories", Product.getCategories());

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .code(200)
                .message("Lấy thông sản phẩm thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/product-variants")
    public ResponseEntity<?> findProductVariants (
        @RequestParam(name = "keyword") String keyword,
        @RequestParam(name = "page") Integer page) {
        Page<ProductVariant> products = productService.getAllProductVariant(
                keyword,
                PageRequest.of(page - 1, ConstantVal.itemPerPage));

        ApiResponse<Page<ProductVariant>> response = ApiResponse.<Page<ProductVariant>>builder()
                .code(200)
                .message("Lấy dữ liệu thành công!")
                .data(products)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/product-variant/{id}")
    public ResponseEntity<?> getProductVariantById(@PathVariable(name = "id") Integer id) {
        
        ProductVariant productVariant = productService.findProductVariantById(id);
        ApiResponse<ProductVariant> response = ApiResponse.<ProductVariant>builder()
                .code(200)
                .message("Lấy dữ liệu thành công!")
                .data(productVariant)
                .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
