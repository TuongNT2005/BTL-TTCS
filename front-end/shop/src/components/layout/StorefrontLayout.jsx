import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import CartDrawer from "../storefront/CartDrawer";
import ToastContainer from "../common/ToastContainer";
import {
  FiShoppingBag,
  FiUser,
  FiSearch,
  FiLogOut,
  FiSliders,
  FiMenu,
  FiX,
} from "react-icons/fi";

export const StorefrontLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { openCart } = useUI();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] text-[#121316]">
      {/* Top Marquee Announcement */}
      <div className="bg-[#121316] text-[#F9F9F8] text-[11px] tracking-widest uppercase py-2 px-4 text-center font-medium select-none overflow-hidden">
        <span>
          Miễn phí vận chuyển đơn từ 1.000.000₫ · Đổi trả trong 7 ngày · Tích lũy 10% Xu cho thành viên
        </span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#F9F9F8]/95 backdrop-blur-md border-b border-[#E6E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#121316] p-2 -ml-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/"
            className="font-editorial text-2xl sm:text-3xl font-bold tracking-widest text-[#121316] uppercase select-none shrink-0"
          >
            ATELIER
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-[#121316] ${
                  isActive ? "text-[#121316] underline underline-offset-8" : "text-[#6B706E]"
                }`
              }
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `transition-colors hover:text-[#121316] ${
                  isActive ? "text-[#121316] underline underline-offset-8" : "text-[#6B706E]"
                }`
              }
            >
              Bộ Sưu Tập
            </NavLink>
            <NavLink
              to="/catalog?category=Sơ mi"
              className={({ isActive }) =>
                `transition-colors hover:text-[#121316] ${
                  isActive ? "text-[#121316] underline underline-offset-8" : "text-[#6B706E]"
                }`
              }
            >
              Áo Sơ Mi
            </NavLink>
            <NavLink
              to="/catalog?category=Quần"
              className={({ isActive }) =>
                `transition-colors hover:text-[#121316] ${
                  isActive ? "text-[#121316] underline underline-offset-8" : "text-[#6B706E]"
                }`
              }
            >
              Quần Âu &amp; Jeans
            </NavLink>
          </nav>

          {/* Right Actions: Search, Cart, User */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative w-48 xl:w-60"
            >
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-1.5 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
              />
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E] pointer-events-none" />
            </form>

            {/* Cart Button with Count Badge */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#121316] hover:text-[#6B706E] transition-colors cursor-pointer"
              aria-label="Open cart"
            >
              <FiShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#121316] text-white text-[10px] font-mono font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-[#121316] hover:text-[#6B706E] transition-colors p-1 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#121316] text-white flex items-center justify-center font-editorial text-xs">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline-block max-w-24 truncate">
                    {user?.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E6E4DF] shadow-xl rounded-[2px] py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-[#E6E4DF]">
                        <p className="text-xs font-semibold text-[#121316] truncate">
                          {user?.username}
                        </p>
                        <p className="text-[11px] text-[#6B706E] truncate">
                          {user?.email || "Thành viên"}
                        </p>
                        {user?.coin != null && (
                          <p className="text-[11px] font-mono text-[#B45309] font-medium mt-1">
                            Xu tích lũy: {user.coin.toLocaleString()} xu
                          </p>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-[#121316] hover:bg-[#F9F9F8] transition-colors font-medium text-[#8C2B2B]"
                        >
                          <FiSliders className="w-3.5 h-3.5" />
                          Trang Quản Trị (Admin)
                        </Link>
                      )}

                      <Link
                        to="/customer/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#121316] hover:bg-[#F9F9F8] transition-colors"
                      >
                        <FiUser className="w-3.5 h-3.5 text-[#6B706E]" />
                        Hồ sơ tài khoản
                      </Link>

                      <Link
                        to="/customer/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#121316] hover:bg-[#F9F9F8] transition-colors"
                      >
                        <FiShoppingBag className="w-3.5 h-3.5 text-[#6B706E]" />
                        Đơn hàng của tôi
                      </Link>

                      <Link
                        to="/customer/refunds"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#121316] hover:bg-[#F9F9F8] transition-colors"
                      >
                        <span className="w-3.5 h-3.5 flex items-center justify-center text-[#6B706E] font-mono text-[10px]">
                          ↩
                        </span>
                        Yêu cầu đổi / trả
                      </Link>

                      <div className="border-t border-[#E6E4DF] my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#8C2B2B] hover:bg-[#FEF2F2] transition-colors cursor-pointer text-left"
                      >
                        <FiLogOut className="w-3.5 h-3.5" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium uppercase tracking-wider text-[#121316] border border-[#121316] px-3.5 py-1.5 rounded-[2px] hover:bg-[#121316] hover:text-white transition-all"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E6E4DF] bg-white px-4 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm trang phục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-2 text-[#121316]"
              />
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
            </form>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#121316] py-1 border-b border-[#E6E4DF]/50"
              >
                Trang Chủ
              </Link>
              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#121316] py-1 border-b border-[#E6E4DF]/50"
              >
                Tất Cả Sản Phẩm
              </Link>
              <Link
                to="/catalog?category=Sơ mi"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#121316] py-1 border-b border-[#E6E4DF]/50"
              >
                Áo Sơ Mi
              </Link>
              <Link
                to="/catalog?category=Quần"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#121316] py-1"
              >
                Quần Âu &amp; Jeans
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <footer className="bg-white border-t border-[#E6E4DF] pt-14 pb-10 text-xs text-[#6B706E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <span className="font-editorial text-2xl font-bold tracking-widest text-[#121316]">
              ATELIER
            </span>
            <p className="leading-relaxed text-[#6B706E] max-w-xs">
              Thương hiệu thời trang may mặc đương đại. Mỗi thiết kế là sự chắt lọc của phom dáng chuẩn mực và chất liệu thượng hạng.
            </p>
          </div>

          {/* Links 1 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-[#121316] tracking-wider uppercase mb-1">
              Bộ Sưu Tập
            </span>
            <Link to="/catalog?category=Sơ mi" className="hover:text-[#121316] transition-colors">
              Áo Sơ Mi May Đo
            </Link>
            <Link to="/catalog?category=Quần" className="hover:text-[#121316] transition-colors">
              Quần Âu Sartorial
            </Link>
            <Link to="/catalog?category=Áo khoác" className="hover:text-[#121316] transition-colors">
              Áo Khoác &amp; Blazer
            </Link>
            <Link to="/catalog" className="hover:text-[#121316] transition-colors">
              Tất Cả Sản Phẩm
            </Link>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-[#121316] tracking-wider uppercase mb-1">
              Chính Sách &amp; Hỗ Trợ
            </span>
            <Link to="/customer/orders" className="hover:text-[#121316] transition-colors">
              Tra Cứu Đơn Hàng
            </Link>
            <Link to="/customer/refunds" className="hover:text-[#121316] transition-colors">
              Chính Sách Đổi Trả 7 Ngày
            </Link>
            <span className="text-[#6B706E]">Hotline: 1900 8888 (08:30 - 21:30)</span>
            <span className="text-[#6B706E]">Email: concierge@atelier.vn</span>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <span className="font-medium text-[#121316] tracking-wider uppercase mb-1">
              Bản Tin Lookbook
            </span>
            <p className="leading-relaxed">
              Đăng ký để nhận thông tin sớm về các bộ sưu tập giới hạn và ưu đãi dành riêng.
            </p>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="Địa chỉ email..."
                className="bg-[#F9F9F8] border border-[#E6E4DF] px-3 py-2 rounded-[2px] text-xs text-[#121316] w-full focus:outline-none focus:border-[#121316]"
              />
              <button
                type="button"
                className="bg-[#121316] text-white px-4 py-2 rounded-[2px] text-xs font-medium hover:bg-black transition-colors cursor-pointer shrink-0"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 mt-10 border-t border-[#E6E4DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 ATELIER Sartorial Ready-to-Wear. Tất cả quyền được bảo lưu.</p>
          <p className="font-mono text-[#6B706E]">BTL TTCS — Modern Apparel E-Commerce Platform</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Global Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export default StorefrontLayout;

