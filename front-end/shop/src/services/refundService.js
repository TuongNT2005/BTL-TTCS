import apiClient from "./apiClient";

export const refundService = {
  createRefundRequest: async (refundData) => {
    return await apiClient.post("/refund-requests", refundData);
  },

  getMyRefundRequests: async ({
    status = "",
    keyword = "",
    page = 1,
    size = 10
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (status) params.append("status", status);
    if (keyword) params.append("keyword", keyword);

    return await apiClient.get(`/refund-requests/my-requests?${params.toString()}`);
  },

  getRefundRequestById: async (id) => {
    return await apiClient.get(`/refund-requests/${id}`);
  },

  searchRefundRequestsAdmin: async ({
    status = "",
    keyword = "",
    userId = null,
    page = 1,
    size = 10
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (status) params.append("status", status);
    if (keyword) params.append("keyword", keyword);
    if (userId != null) params.append("userId", userId);

    return await apiClient.get(`/refund-requests?${params.toString()}`);
  },

  updateRefundStatus: async (id, updateData) => {
    return await apiClient.put(`/refund-requests/${id}`, updateData);
  }
};

export default refundService;

