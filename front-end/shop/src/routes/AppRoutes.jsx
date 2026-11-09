import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import StorefrontLayout from "../components/layout/StorefrontLayout";
import CustomerLayout from "../components/layout/CustomerLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Storefront Pages
import HomePage from "../pages/Storefront/HomePage";
import ProductCatalogPage from "../pages/Storefront/ProductCatalogPage";
import ProductDetailPage from "../pages/Storefront/ProductDetailPage";
import CheckoutPage from "../pages/Storefront/CheckoutPage";

// Customer Pages
import ProfilePage from "../pages/Customer/ProfilePage";
import OrdersHistoryPage from "../pages/Customer/OrdersHistoryPage";
import BoughtItemsPage from "../pages/Customer/BoughtItemsPage";
import MyRefundRequestsPage from "../pages/Customer/MyRefundRequestsPage";

// Auth Pages
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

// Admin Pages
import DashboardPage from "../pages/Admin/DashboardPage";
import ProductsManagePage from "../pages/Admin/ProductsManagePage";
import WarehouseManagePage from "../pages/Admin/WarehouseManagePage";
import OrdersManagePage from "../pages/Admin/OrdersManagePage";
import EventsManagePage from "../pages/Admin/EventsManagePage";
import RefundsManagePage from "../pages/Admin/RefundsManagePage";
import UsersManagePage from "../pages/Admin/UsersManagePage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Customer Routes wrapped in Storefront Layout */}
      <Route element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<ProductCatalogPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* Protected Checkout */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Customer Portal */}
        <Route
          path="customer"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersHistoryPage />} />
          <Route path="bought-items" element={<BoughtItemsPage />} />
          <Route path="refunds" element={<MyRefundRequestsPage />} />
        </Route>
      </Route>

      {/* Authentication */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* Admin Suite with AdminLayout */}
      <Route
        path="admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsManagePage />} />
        <Route path="warehouse" element={<WarehouseManagePage />} />
        <Route path="orders" element={<OrdersManagePage />} />
        <Route path="events" element={<EventsManagePage />} />
        <Route path="refunds" element={<RefundsManagePage />} />
        <Route path="users" element={<UsersManagePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

