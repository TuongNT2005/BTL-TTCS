import Container from "./Container";
import { IoIosSearch } from "react-icons/io";
import { IoMenuSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCallback, useRef } from "react";

export default function Header({ keyword, setKeyword, mobileMenuOpen, setMobileMenuOpen, setIsSearching }) {
  const navItems = ["Tìm kiếm", "Thể loại", "Sự kiện", "Hot", "Mới"];
  const navigate = useNavigate();

  function onGoToCustomerPage() {
    navigate("/customer");
  }

  const timer = useRef(null);

  const debound = useCallback((e) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setKeyword(e.target.value);
    }, 500)
  }, [setKeyword])

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-violet-200 p-2 text-violet-700 lg:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <IoMenuSharp size={20} />
            </button>
            <div className="text-2xl font-black tracking-wide text-violet-700">
              TGSHOP
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-slate-700 transition hover:text-violet-700"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center rounded-2xl border border-violet-200 bg-violet-50 px-3 md:flex">
              <IoIosSearch size={18} className="text-violet-500" />
              <input
                onChange={debound}
                placeholder="Tìm sản phẩm..."
                className="h-10 w-52 bg-transparent px-2 text-sm outline-none lg:w-64"
              />
            </div>
            <button className="rounded-2xl bg-violet-600 p-2.5 text-white shadow-sm cursor-pointer" onClick={onGoToCustomerPage}>
              <FaUser size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-violet-100 py-4 lg:hidden">
            <div className="flex items-center rounded-2xl border border-violet-200 bg-violet-50 px-3 md:hidden">
              <IoIosSearch size={18} className="text-violet-500" />
              <input
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setIsSearching(true)
                }}
                placeholder="Tìm sản phẩm..."
                className="h-10 w-full bg-transparent px-2 text-sm outline-none"
              />
            </div>
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="block text-sm font-medium text-slate-700"
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
}