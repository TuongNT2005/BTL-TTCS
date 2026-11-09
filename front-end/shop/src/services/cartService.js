import apiClient from "./apiClient";

export const cartService = {
  getCart: async ({ page = 1, size = 50 } = {}) => {
    return await apiClient.get(`/cart?page=${page}&size=${size}`);
  },

  addToCart: async (productVariantId, quantity = 1) => {
    return await apiClient.post("/cart/items", {
      productVariantId,
      quantity,
    });
  },

  updateCartItemQuantity: async (cartItemId, quantity) => {
    return await apiClient.put(`/cart/items/${cartItemId}`, {
      quantity,
    });
  },

  deleteCartItems: async (ids) => {
    const idArray = Array.isArray(ids) ? ids : [ids];
    const params = new URLSearchParams();
    idArray.forEach((id) => params.append("ids", id));
    return await apiClient.delete(`/cart/items?${params.toString()}`);
  }
};

export default cartService;

