import apiClient from "./apiClient";

export const authService = {
  login: async (credentials) => {
    return await apiClient.post("/auth/login", credentials);
  },

  register: async (userData) => {
    return await apiClient.post("/auth/register", userData);
  },

  refresh: async (refreshToken) => {
    return await apiClient.post("/auth/refresh", { refreshToken });
  },

  logout: async () => {
    try {
      return await apiClient.post("/auth/logout");
    } catch {
      // Ignore logout backend error, clear locally
      return null;
    }
  },
};

export default authService;

