import apiClient from "./apiClient";

export const commentService = {
  getComments: async (productId, { sortBy = ["createdAt"], sortDir = ["desc"] } = {}) => {
    const params = new URLSearchParams();
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

    return await apiClient.get(`/products/${productId}/comments?${params.toString()}`);
  },

  createComment: async (productId, { star, content }) => {
    return await apiClient.post(`/products/${productId}/comments`, {
      productId,
      star,
      content,
    });
  }
};

export default commentService;

