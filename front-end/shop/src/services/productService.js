import apiClient from "./apiClient";

export const productService = {
  getProducts: async ({
    page = 1,
    size = 12,
    productName = "",
    category = "",
    sortBy = ["id"],
    sortDir = ["desc"]
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (productName) params.append("productName", productName);
    if (category) params.append("category", category);

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

    return await apiClient.get(`/products?${params.toString()}`);
  },

  getProductDetail: async (productId) => {
    return await apiClient.get(`/products/${productId}`);
  },

  createProduct: async (productData) => {
    return await apiClient.post("/products", productData);
  },

  updateProduct: async (productId, productData) => {
    return await apiClient.put(`/products/${productId}`, productData);
  }
};

export default productService;

