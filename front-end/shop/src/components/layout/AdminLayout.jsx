import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ToastContainer from "../common/ToastContainer";
import {
  FiGrid,
  FiBox,
  FiArchive,
  FiShoppingBag,
  FiTag,
  FiRotateCcw,
  FiUsers,
  FiArrowLeft,
  FiLogOut,
} from "react-icons/fi";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/admin", label: "Tổng Quan", icon: FiGrid, end: true },
    { to: "/admin/products", label: "Sản Phẩm", icon: FiBox },
    { to: "/admin/warehouse", label: "Biến Thể & Kho Hàng", icon: FiArchive },
    { to: "/admin/orders", label: "Quản Lý Đơn Hàng", icon: FiShoppingBag },
    { to: "/admin/events", label: "Chiến Dịch Khuyến Mãi", icon: FiTag },
    { to: "/admin/refunds", label: "Duyệt Yêu Cầu Đổi Trả", icon: FiRotateCcw },
    { to: "/admin/users", label: "Quản Lý Người Dùng", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen flex bg-[#F9F9F8] text-[#121316]">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-[#121316] text-[#F9F9F8] flex flex-col shrink-0 border-r border-[#121316] z-30">
        {/* Header / Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#2A2B30]">
          <Link to="/admin" className="font-editorial text-lg font-bold tracking-widest uppercase">
            ATELIER <span className="text-[10px] font-sans font-normal tracking-normal text-[#E6E4DF]/70 ml-1">ADMIN</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-[2px] transition-colors ${
                    isActive
                      ? "bg-white text-[#121316] font-semibold"
                      : "text-[#E6E4DF]/70 hover:text-white hover:bg-[#2A2B30]"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Back to store */}
        <div className="p-4 border-t border-[#2A2B30] flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#E6E4DF]/70 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Về trang mua sắm</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#8C2B2B] hover:text-[#FECACA] transition-colors cursor-pointer text-left"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E6E4DF] px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#6B706E]">
              BẢNG QUẢN TRỊ HỆ THỐNG
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#6B706E]">Quản trị viên:</span>
            <span className="font-semibold text-[#121316]">
              {user?.username || "Admin"}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#121316] text-white flex items-center justify-center font-editorial text-xs">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;

