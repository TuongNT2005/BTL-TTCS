package com.example.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.AddToCartRequest;
import com.example.shop.dto.request.DeleteFromCartRequest;
import com.example.shop.dto.response.AddToCartResponse;
import com.example.shop.dto.response.CartItemDTO;
import com.example.shop.dto.response.DeleteFromCartResponse;
import com.example.shop.entity.CartItem;
import com.example.shop.service.AuthService;
import com.example.shop.service.CartService;
import com.example.shop.util.Converter;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired private CartService cartService;
    @Autowired private AuthService authService;

    @PostMapping("/add-to-cart")
    public ResponseEntity<?> addToCart(AddToCartRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        CartItem addedCartItem = cartService.addToCart(userId, request.getProductVariantId());

        ApiResponse<AddToCartResponse> response = ApiResponse.<AddToCartResponse>builder()
                                .code(200)
                                .message("Thêm biến thể vào giỏ hàng thành công!")
                                .data(Converter.parseCartItemToAddToCartResponse(addedCartItem))
                                .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
       
    }

    @DeleteMapping("/delete-from-cart")
    public ResponseEntity<?> deleteFromCart(DeleteFromCartRequest request) {

        List<CartItem> deletedCartItems = cartService.deleteCartItems(request.getCartItemIds());
        ApiResponse<DeleteFromCartResponse> response = ApiResponse.<DeleteFromCartResponse>builder()
                                .code(200)
                                .message("Xoá thành công!")
                                .data(new DeleteFromCartResponse(deletedCartItems))
                                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("")
    public ResponseEntity<?> getMethodName(@RequestParam(name = "page") Integer page) {

        Integer userId = authService.getAuthenticatedUserId();
        Page<CartItemDTO> cartItemDTOs = cartService.findAllCartItemByUserId(userId, page-1);
         ApiResponse<Page<CartItemDTO>> response = ApiResponse.<Page<CartItemDTO>>builder()
            .code(200)
            .message("Lấy dữ liệu thành công!")
            .data(cartItemDTOs)
            .build(); 

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
