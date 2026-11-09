import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";
import { useUI } from "./UIContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast, openCart } = useUI();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart({ page: 1, size: 100 });
      // Backend returns ApiResponse<Page<CartItemWithProductVariant>>
      const content = res?.data?.content || res?.data || [];
      setCartItems(Array.isArray(content) ? content : []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.price || item.productVariantPrice || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const addToCart = async (variantId, quantity = 1, showDrawer = true) => {
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", "info");
      return { success: false, requireAuth: true };
    }

    try {
      await cartService.addToCart(variantId, quantity);
      await fetchCart();
      showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
      if (showDrawer) {
        openCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể thêm vào giỏ hàng";
      showToast(msg, "error");
      return { success: false, error: msg };
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItems([cartItemId]);
    }

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await cartService.updateCartItemQuantity(cartItemId, newQuantity);
    } catch (err) {
      showToast("Không thể cập nhật số lượng", "error");
      fetchCart(); // Revert
    }
  };

  const removeItems = async (ids) => {
    const idArray = Array.isArray(ids) ? ids : [ids];
    setCartItems((prev) => prev.filter((item) => !idArray.includes(item.id)));

    try {
      await cartService.deleteCartItems(idArray);
      showToast("Đã xóa sản phẩm khỏi giỏ hàng", "info");
    } catch (err) {
      showToast("Không thể xóa sản phẩm", "error");
      fetchCart(); // Revert
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;

