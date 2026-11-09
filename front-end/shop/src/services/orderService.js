import apiClient from "./apiClient";

export const orderService = {
  createOrder: async (orderData) => {
    return await apiClient.post("/orders", orderData);
  },

  getMyOrders: async ({
    status = "",
    startDate = null,
    endDate = null,
    page = 1,
    size = 10
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (status) params.append("status", status);
    if (startDate) params.append("startAt", startDate);
    if (endDate) params.append("endAt", endDate);

    return await apiClient.get(`/orders/my-orders?${params.toString()}`);
  },

  getOrderDetail: async (orderId) => {
    return await apiClient.get(`/orders/${orderId}`);
  },

  payOrder: async (orderId) => {
    return await apiClient.post(`/orders/${orderId}/pay`);
  },

  cancelOrder: async (orderId) => {
    return await apiClient.post(`/orders/${orderId}/cancel`);
  },

  getBoughtItems: async ({ page = 1, size = 20 } = {}) => {
    return await apiClient.get(`/orders/bought-items?page=${page}&size=${size}`);
  },

  // Admin APIs
  searchOrdersAdmin: async ({
    status = "",
    receiverName = "",
    phone = "",
    address = "",
    startAt = "2025-01-01",
    endAt = "2100-01-01",
    page = 1,
    size = 10,
    sortBy = ["id"],
    sortDir = ["desc"]
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (status) params.append("status", status);
    if (receiverName) params.append("receiverName", receiverName);
    if (phone) params.append("phone", phone);
    if (address) params.append("address", address);
    if (startAt) params.append("startAt", startAt);
    if (endAt) params.append("endAt", endAt);

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

    return await apiClient.get(`/orders?${params.toString()}`);
  },

  confirmDelivery: async (orderId) => {
    return await apiClient.put(`/orders/set-sending/${orderId}`);
  }
};

export default orderService;

