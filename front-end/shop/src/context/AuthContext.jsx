import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import userService from "../services/userService";
import { useUI } from "./UIContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("authUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const [loading, setLoading] = useState(true);
  const { showToast } = useUI();

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role ? user.role.toUpperCase().includes("ADMIN") : false;

  const fetchCurrentUserProfile = useCallback(async () => {
    try {
      const res = await userService.getProfile();
      if (res?.data) {
        setUser((prev) => {
          const updated = { ...prev, ...res.data };
          localStorage.setItem("authUser", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCurrentUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      showToast("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error");
    };

    const handleTokenRefreshed = (e) => {
      const newToken = e.detail?.newToken;
      if (newToken) {
        setToken(newToken);
      }
    };

    window.addEventListener("onAuthExpired", handleAuthExpired);
    window.addEventListener("onTokenRefreshed", handleTokenRefreshed);

    return () => {
      window.removeEventListener("onAuthExpired", handleAuthExpired);
      window.removeEventListener("onTokenRefreshed", handleTokenRefreshed);
    };
  }, [token, fetchCurrentUserProfile, showToast]);

  const login = async (username, password) => {
    try {
      const res = await authService.login({ username, password });
      const data = res?.data;

      if (!data?.accessToken) {
        throw new Error(res?.message || "Đăng nhập không thành công!");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      const userData = {
        id: data.userId,
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      setUser(userData);
      setToken(data.accessToken);
      localStorage.setItem("authUser", JSON.stringify(userData));

      // Fetch profile to get address, phone, coin
      try {
        const profileRes = await userService.getProfile();
        if (profileRes?.data) {
          const fullUser = { ...userData, ...profileRes.data };
          setUser(fullUser);
          localStorage.setItem("authUser", JSON.stringify(fullUser));
        }
      } catch {
        // Continue with basic user info
      }

      showToast(`Chào mừng trở lại, ${data.username}!`, "success");
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Tài khoản hoặc mật khẩu không chính xác";
      showToast(msg, "error");
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      showToast("Đăng ký tài khoản thành công! Hãy đăng nhập.", "success");
      return { success: true, data: res?.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại!";
      showToast(msg, "error");
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    showToast("Đã đăng xuất khỏi hệ thống.", "info");
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem("authUser", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUserProfile,
        refreshProfile: fetchCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

