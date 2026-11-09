package com.example.shop.controller;

import java.net.URI;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.CartItemWithProductVariant;
import com.example.shop.dto.request.AddToCartRequest;
import com.example.shop.dto.request.UpdateCartItemRequest;
import com.example.shop.entity.CartItem;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.service.AuthService;
import com.example.shop.service.CartService;

import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class CartController {

    private final AuthService authService;
    private final CartService cartService;
    private final CartItemRepository cartItemRepository;

    public CartController(AuthService authService,
                          CartService cartService,
                          CartItemRepository cartItemRepository) {
        this.authService = authService;
        this.cartService = cartService;
        this.cartItemRepository = cartItemRepository;
    }

    @PostMapping({"/items", "/item"})
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        CartItem cartItem = cartService.createNewCartItem(request.getProductVariantId(), request.getQuantity(), userId);

        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(201)
                .message("Thao tác thành công!")
                .data(cartItem.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/cart/items/" + cartItem.getId()))
                .body(response);
    }

    @PostMapping("item/{productVariantId}")
    public ResponseEntity<?> addToCartPathVariable(@PathVariable(name = "productVariantId") Integer productVariantId) {
        Integer userId = authService.getAuthenticatedUserId();
        CartItem cartItem = cartService.createNewCartItem(productVariantId, 1, userId);

        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(201)
                .message("Thao tác thành công!")
                .data(cartItem.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/cart/items/" + cartItem.getId()))
                .body(response);
    }

    @PutMapping({"/items/{cartItemId}", "/item/{cartItemId}"})
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable(name = "cartItemId") Integer cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        cartService.updateCartItemQuantity(cartItemId, request.getQuantity(), userId);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Cập nhật số lượng giỏ hàng thành công!")
                .data("")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping({"/items", "/item"})
    public ResponseEntity<?> deleteFromCart(@RequestParam(name = "ids") Set<Integer> ids) {
        Integer userId = authService.getAuthenticatedUserId();
        cartService.deleteCartItems(ids, userId);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Thao tác thành công!")
                .data("")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping({"", "/items"})
    public ResponseEntity<?> getCartItems(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false) Integer size,
            @RequestParam(name = "pageSize", required = false) Integer pageSize) {

        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);

        Integer userId = authService.getAuthenticatedUserId();
        Page<CartItemWithProductVariant> cartItemsWithProductVariant = cartItemRepository
                .findCartItemWithProductVariantByUserId(PageRequest.of(safePage, limit), userId);
        ApiResponse<Page<CartItemWithProductVariant>> response = ApiResponse.<Page<CartItemWithProductVariant>>builder()
                .code(200)
                .message("Lấy dữ liệu thành công!")
                .data(cartItemsWithProductVariant)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
