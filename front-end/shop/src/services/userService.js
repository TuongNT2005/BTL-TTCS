import apiClient from "./apiClient";

export const userService = {
  getProfile: async () => {
    return await apiClient.get("/users/profile");
  },

  updateProfile: async (profileData) => {
    return await apiClient.put("/users/profile", profileData);
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    return await apiClient.put("/users/password", {
      oldPassword,
      newPassword,
    });
  },

  searchUsersAdmin: async ({
    keyword = "",
    page = 1,
    size = 10,
    sortBy = ["id"],
    sortDir = ["desc"]
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (keyword) params.append("keyword", keyword);

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

    return await apiClient.get(`/users?${params.toString()}`);
  }
};

export default userService;

