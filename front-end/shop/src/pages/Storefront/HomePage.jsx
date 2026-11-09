import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import eventService from "../../services/eventService";
import ProductCard from "../../components/storefront/ProductCard";
import Skeleton from "../../components/common/Skeleton";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils/formatters";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, eventRes] = await Promise.all([
          productService.getProducts({ size: 8, sortBy: ["id"], sortDir: ["desc"] }),
          eventService.getEvents({ status: "AVAILABLE", size: 3 }),
        ]);

        const prodList = prodRes?.data?.content || prodRes?.data || [];
        setProducts(Array.isArray(prodList) ? prodList : []);

        const eventList = eventRes?.data?.content || eventRes?.data || [];
        setEvents(Array.isArray(eventList) ? eventList : []);
      } catch (err) {
        console.error("Failed to load home page data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* Editorial Hero Section */}
      <section className="relative bg-[#121316] text-[#F9F9F8] overflow-hidden min-h-[580px] sm:min-h-[680px] flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80"
            alt="Atelier Campaign"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-start max-w-2xl">
          <span className="text-xs font-mono tracking-widest text-[#E6E4DF] uppercase mb-4">
            Lookbook Thu Đông 2026
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-normal leading-[1.1] mb-6 text-white">
            Chuẩn Mực May Mặc Đương Đại.
          </h1>
          <p className="text-sm sm:text-base text-[#E6E4DF]/90 font-light leading-relaxed mb-8 max-w-lg">
            Sự giao thoa giữa phom dáng cổ điển và kỹ thuật dệt may hiện đại. Những thiết kế tôn vinh tính cá nhân và trường tồn qua thời gian.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/catalog">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-[#121316] border-white hover:bg-transparent hover:text-white"
              >
                Khám Phá Bộ Sưu Tập
              </Button>
            </Link>
            <Link to="/catalog?category=Sơ mi">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 border-white/30"
              >
                Áo Sơ Mi May Đo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Campaign Events Banner */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E6E4DF]">
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#121316]">
              Chiến Dịch Khuyến Mãi
            </h2>
            <span className="text-xs text-[#6B706E] font-mono uppercase tracking-wider">
              Đang Diễn Ra
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex flex-col justify-between hover:border-[#121316] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] rounded-[2px] border border-[#BFDBFE]">
                      Chiết khấu {ev.discount || 10}%
                    </span>
                    <span className="text-xs text-[#6B706E]">
                      Đến {formatDate(ev.endAt)}
                    </span>
                  </div>
                  <h3 className="font-editorial text-lg font-medium text-[#121316] mb-2 line-clamp-1">
                    {ev.name || "Sự kiện đặc quyền"}
                  </h3>
                  <p className="text-xs text-[#6B706E] line-clamp-2 leading-relaxed">
                    {ev.description || "Ưu đãi giá tốt nhất cho các dòng sản phẩm trong sự kiện."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E4DF]/60 flex items-center justify-between">
                  <span className="text-xs text-[#6B706E]">Áp dụng tự động</span>
                  <Link
                    to="/catalog"
                    className="text-xs font-semibold text-[#121316] hover:underline"
                  >
                    Xem sản phẩm
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E6E4DF] gap-4">
          <div>
            <span className="text-xs font-mono text-[#6B706E] uppercase tracking-wider block mb-1">
              Tuyển Tập Mới
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#121316]">
              Thiết Kế Mới Nhất
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-medium uppercase tracking-wider text-[#121316] hover:text-[#6B706E] transition-colors"
          >
            Xem tất cả ({products.length})
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col gap-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6B706E]">
            Hiện tại chưa có sản phẩm nào được cập nhật.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Manifesto / Editorial Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border border-[#E6E4DF] p-8 sm:p-14 rounded-[2px] grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-editorial text-xl font-medium text-[#121316]">
              01. Kỹ Thuật May Đo
            </span>
            <p className="text-xs text-[#6B706E] leading-relaxed">
              Mỗi đường kim mũi chỉ đều được trau chuốt bởi những người thợ may lành nghề theo kỹ nghệ may đo bán thủ công.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-editorial text-xl font-medium text-[#121316]">
              02. Sợi Dệt Tự Nhiên
            </span>
            <p className="text-xs text-[#6B706E] leading-relaxed">
              Tuyển chọn các chất liệu Cotton Ai Cập, Len Merino và Linen thoáng khí, đảm bảo sự thoải mái cả ngày dài.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-editorial text-xl font-medium text-[#121316]">
              03. Đổi Trả Minh Bạch
            </span>
            <p className="text-xs text-[#6B706E] leading-relaxed">
              Cam kết hỗ trợ đổi trả và hoàn xu tức thì trong 7 ngày nếu kích cỡ hay phom dáng không đáp ứng kỳ vọng của bạn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

