import apiClient from "./apiClient";

export const productVariantService = {
  getVariants: async ({
    productName = "",
    color = "",
    size = "",
    status = "",
    productId,
    page = 1,
    size: limit = 10,
    sortBy = ["id"],
    sortDir = ["desc"]
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", limit);
    if (productName) params.append("productName", productName);
    if (color) params.append("color", color);
    if (size) params.append("size", size);
    if (status) params.append("status", status);
    if (productId != null) params.append("productId", productId);

    if (Array.isArray(sortBy)) {
      sortBy.forEach((sb) => params.append("sortBy", sb));
    } else if (sortBy) {
      params.append("sortBy", sortBy);
    }

    if (Array.isArray(sortDir)) {
      sortDir.forEach((sd) => params.append("sortDir", sd));
    } else if (sortDir) {
      params.append("sortDir", sortDir);
    }

    return await apiClient.get(`/product-variants?${params.toString()}`);
  },

  getVariantById: async (id) => {
    return await apiClient.get(`/product-variants/${id}`);
  },

  updateVariant: async (id, variantData) => {
    return await apiClient.put(`/product-variants/${id}`, variantData);
  },

  importVariant: async (productId, importData) => {
    return await apiClient.post(`/product-variants?productId=${productId}`, importData);
  }
};

export default productVariantService;

