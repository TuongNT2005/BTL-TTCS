package com.example.shop.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.shop.entity.CartItem;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.User;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.exception.ActionUnavailableException;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    public CartService(CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       ProductVariantRepository productVariantRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productVariantRepository = productVariantRepository;
    }

    @Transactional
    public CartItem createNewCartItem(Integer productVariantId, Integer quantity, Integer userId) {

        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new NotFoundException("Người dùng không tồn tại!");
        }
        ProductVariant productVariant = productVariantRepository.findProductVariantById(productVariantId);
        if (productVariant == null) {
            throw new NotFoundException("Biến thể sản phẩm không tồn tại!");
        }

        if (productVariant.getStatus() != ProductVariantStatus.AVALIBLE) {
            throw new ActionUnavailableException("Biến thể đang không trong trạng thái có thể giao dịch!");
        }

        Optional<CartItem> cartItemContainer = cartItemRepository.findByUserIdAndProductVariantId(userId,
                productVariantId);
        if (cartItemContainer.isPresent()) {
            throw new ActionUnavailableException("Biến thể đã tồn tại trong giỏ hàng!");
        }

        int itemQty = (quantity != null && quantity > 0) ? quantity : 1;
        if (productVariant.getQuantity() != null && productVariant.getQuantity() < itemQty) {
            throw new ActionUnavailableException("Số lượng trong kho không đủ (chỉ còn " + productVariant.getQuantity() + ")!");
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .productVariant(productVariant)
                .quantity(itemQty)
                .build();

        return cartItemRepository.save(cartItem);
    }

    public void createNewCartItem(Integer productVariantId, Integer userId) {
        createNewCartItem(productVariantId, 1, userId);
    }

    @org.springframework.transaction.annotation.Transactional
    public CartItem updateCartItemQuantity(Integer cartItemId, Integer quantity, Integer userId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy mục trong giỏ hàng!")
        );

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new ActionUnavailableException("Bạn không có quyền chỉnh sửa mục giỏ hàng này!");
        }

        if (quantity == null || quantity <= 0) {
            throw new ActionUnavailableException("Số lượng phải lớn hơn 0!");
        }

        ProductVariant pv = cartItem.getProductVariant();
        if (pv != null && pv.getQuantity() != null && pv.getQuantity() < quantity) {
            throw new ActionUnavailableException("Số lượng trong kho không đủ (chỉ còn " + pv.getQuantity() + ")!");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteCartItems(Set<Integer> uniqueCartItemIds, Integer userId) {
        if (uniqueCartItemIds == null || uniqueCartItemIds.isEmpty()) return;
        List<Integer> validDeleteIds = new ArrayList<>();

        for (Integer cartItemId : uniqueCartItemIds) {
            Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
            if (cartItemOpt.isPresent() && cartItemOpt.get().getUser().getId().equals(userId)) {
                validDeleteIds.add(cartItemId);
            }
        }

        if (!validDeleteIds.isEmpty()) {
            cartItemRepository.deleteAllByIdInBatch(validDeleteIds);
        }
    }

    public void deleteCartItems(Set<Integer> uniqueCartItemIds) {
        if (uniqueCartItemIds == null || uniqueCartItemIds.isEmpty()) return;
        List<Integer> validDeleteIds = new ArrayList<>();

        for (Integer cartItemId : uniqueCartItemIds) {
            if (cartItemRepository.existsById(cartItemId)) {
                validDeleteIds.add(cartItemId);
            }
        }

        if (!validDeleteIds.isEmpty()) {
            cartItemRepository.deleteAllByIdInBatch(validDeleteIds);
        }
    }


    // public CartItem findCartItemById(Integer id) {
    // return cartItemRepository.findById(id)
    // .orElseThrow(() -> new NotFoundException(String.format("CartItem với id = %d
    // không tồn tại!", id)));
    // }

    // public CartItem updateQuantity(CartItem cartItem, Integer quantity) {
    // try {
    // cartItem.setQuantity(cartItem.getQuantity() + quantity);
    // return cartItem;
    // } catch (Exception e) {
    // System.out.println(e.getMessage());
    // throw new RuntimeException(e.getMessage());
    // }

    // }

    // public List<CartItem> deleteCartItems(List<Integer> cartItemIds) {
    // try {
    // List<CartItem> lst = new ArrayList<>();
    // for (Integer cartItemId : cartItemIds) {
    // Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);
    // if (cartItem.isPresent())
    // lst.add(cartItem.get());
    // }
    // for (CartItem cartItem : lst) {
    // cartItemRepository.delete(cartItem);
    // }
    // return lst;
    // } catch (Exception e) {
    // System.out.println(e.getMessage());
    // throw new RuntimeException(e.getMessage());
    // }
    // }

    // public CartItem deleteCartItem(CartItem cartItem) {
    // try {
    // cartItemRepository.delete(cartItem);
    // return cartItem;
    // } catch (Exception e) {
    // System.out.println(e.getMessage());
    // throw new RuntimeException(e.getMessage());
    // }
    // }

    // public CartItemDTO convertToCariItemDTO(CartItem cartItem) {
    // try {

    // ProductVariant productVariant =
    // productService.findProductVariantById(cartItem.getProductVariantId());
    // ProductVariantDTO productVariantDTO =
    // productService.convertToProductVariantDTO(productVariant);
    // return CartItemDTO.builder()
    // .cartItem(cartItem)
    // .productVariantDTO(productVariantDTO)
    // .build();
    // } catch (Exception e) {
    // System.out.println(e.getMessage());
    // throw new RuntimeException(e.getMessage());
    // }
    // }

    // public Page<CartItemDTO> findAllCartItemByUserId(Integer userId, Integer
    // page) {
    // try {
    // Page<CartItem> cartItems = cartItemRepository.findAllByUserId(userId,
    // PageRequest.of(page, ConstantVal.itemPerPage));
    // Page<CartItemDTO> cartItemDTOs = cartItems.map((item) ->
    // convertToCariItemDTO(item));
    // return cartItemDTOs;
    // } catch (Exception e) {
    // System.out.println(e.getMessage());
    // throw new RuntimeException(e.getMessage());
    // }
    // }
}
