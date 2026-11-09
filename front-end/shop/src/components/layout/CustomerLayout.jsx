import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiPackage, FiRotateCcw, FiList, FiLogOut } from "react-icons/fi";

export const CustomerLayout = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: "/customer/profile", label: "Hồ Sơ Cá Nhân", icon: FiUser },
    { to: "/customer/orders", label: "Đơn Hàng Của Tôi", icon: FiPackage },
    { to: "/customer/bought-items", label: "Sản Phẩm Đã Mua", icon: FiList },
    { to: "/customer/refunds", label: "Yêu Cầu Đổi / Trả", icon: FiRotateCcw },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 flex flex-col gap-6">
          {/* User Card */}
          <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#121316] text-white flex items-center justify-center font-editorial text-lg shrink-0">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-[#121316] truncate">
                {user?.username}
              </h4>
              <p className="text-xs text-[#6B706E] truncate">
                {user?.email || "Khách hàng"}
              </p>
              {user?.coin != null && (
                <div className="mt-1 text-xs font-mono text-[#B45309] font-medium">
                  {user.coin.toLocaleString()} xu
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white border border-[#E6E4DF] rounded-[2px] p-2 flex flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-[2px] transition-colors ${
                      isActive
                        ? "bg-[#121316] text-white"
                        : "text-[#121316] hover:bg-[#F9F9F8]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            <div className="border-t border-[#E6E4DF] my-1" />

            <button
              onClick={logout}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-[#8C2B2B] hover:bg-[#FEF2F2] rounded-[2px] transition-colors cursor-pointer text-left"
            >
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <section className="md:col-span-3">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default CustomerLayout;

