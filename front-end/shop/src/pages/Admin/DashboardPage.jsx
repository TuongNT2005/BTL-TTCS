import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import refundService from "../../services/refundService";
import userService from "../../services/userService";
import { formatVND, formatDateTime, getOrderStatusMeta } from "../../utils/formatters";
import {
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiRotateCcw,
  FiArrowRight,
  FiPlus,
  FiArchive,
} from "react-icons/fi";

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRefunds: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prodRes, orderRes, refundRes, userRes] = await Promise.all([
          productService.getProducts({ size: 1 }),
          orderService.searchOrdersAdmin({ size: 5, status: "" }),
          refundService.searchRefundRequestsAdmin({ size: 1, status: "PENDING" }),
          userService.searchUsersAdmin({ size: 1 }),
        ]);

        setStats({
          totalProducts: prodRes?.data?.totalElements ?? 0,
          totalOrders: orderRes?.data?.totalElements ?? 0,
          totalRefunds: refundRes?.data?.totalElements ?? 0,
          totalUsers: userRes?.data?.totalElements ?? 0,
        });

        const ordersList = orderRes?.data?.content || [];
        setRecentOrders(Array.isArray(ordersList) ? ordersList : []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#121316]">
            Bảng Điều Khiển Tổng Quan
          </h1>
          <p className="text-xs text-[#6B706E] mt-0.5">
            Dữ liệu vận hành hệ thống thương mại may mặc ATELIER.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#121316] text-white rounded-[2px] hover:bg-black transition-colors"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Thêm sản phẩm</span>
          </Link>
          <Link
            to="/admin/warehouse"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white border border-[#121316] text-[#121316] rounded-[2px] hover:bg-[#F9F9F8] transition-colors"
          >
            <FiArchive className="w-3.5 h-3.5" />
            <span>Nhập kho</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B706E] uppercase tracking-wider block mb-1">
              Tổng Mẫu Thiết Kế
            </span>
            <span className="font-mono text-2xl font-bold text-[#121316]">
              {stats.totalProducts}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F9F9F8] border border-[#E6E4DF] flex items-center justify-center text-[#121316]">
            <FiBox className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B706E] uppercase tracking-wider block mb-1">
              Tổng Đơn Hàng
            </span>
            <span className="font-mono text-2xl font-bold text-[#121316]">
              {stats.totalOrders}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F9F9F8] border border-[#E6E4DF] flex items-center justify-center text-[#121316]">
            <FiShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B706E] uppercase tracking-wider block mb-1">
              Đổi Trả Chờ Duyệt
            </span>
            <span className="font-mono text-2xl font-bold text-[#B45309]">
              {stats.totalRefunds}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#B45309]">
            <FiRotateCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B706E] uppercase tracking-wider block mb-1">
              Thành Viên Đăng Ký
            </span>
            <span className="font-mono text-2xl font-bold text-[#121316]">
              {stats.totalUsers}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F9F9F8] border border-[#E6E4DF] flex items-center justify-center text-[#121316]">
            <FiUsers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between">
          <h3 className="font-editorial text-lg font-medium text-[#121316]">
            Đơn Hàng Gần Đây
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs font-medium text-[#121316] hover:text-[#6B706E] inline-flex items-center gap-1"
          >
            <span>Quản lý tất cả</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Điện thoại</th>
                <th className="px-6 py-3">Ngày đặt</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#6B706E]">
                    Chưa có đơn hàng nào phát sinh.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => {
                  const statusMeta = getOrderStatusMeta(ord.status);
                  return (
                    <tr key={ord.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-medium text-[#121316]">
                        #ORD-{ord.id}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-[#121316]">
                        {ord.receiverName || ord.name || "—"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                        {ord.phone || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-[#6B706E]">
                        {formatDateTime(ord.createdAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-[2px] ${statusMeta.classes}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

