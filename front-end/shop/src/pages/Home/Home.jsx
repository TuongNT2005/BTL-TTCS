import React, { useMemo, useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";
import { IoMenuSharp } from "react-icons/io5";
import { BiSolidShoppingBag } from "react-icons/bi";

import Container from "./Container";
import SectionHeader from "./SectionHeader";
import EventSection from "./EventSection/EventSection";
import ProductCard from "./ProductCard";
import HotProductSection from "./HotProductSection/HotProductSection";

const categories = [
  { id: 1, name: "Áo" },
  { id: 2, name: "Quần" },
  { id: 3, name: "Váy/ Đầm" },
  { id: 4, name: "Đồ bộ" },
  { id: 5, name: "Thể thao" },
  { id: 6, name: "Sự kiện" },
];



const products = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: "Áo dài",
  category: "Áo",
  price: 150000,
  salePrice: 150000,
  discount: 0,
  stock: 100,
  size: "L",
  color: "Hồng cánh sen",
  image: `https://placehold.co/600x800/f8d7da/8b5cf6?text=Ao+dai+${i + 1}`,
}));

const comments = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  name: "Jame Kenael",
  date: "21/02/2026",
  content:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
}));

const formatVND = (n) => `${n.toLocaleString("vi-VN")}đ`;

function Header({ keyword, setKeyword, mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = ["Tìm kiếm", "Thể loại", "Sự kiện", "Hot", "Mới"];

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
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="h-10 w-52 bg-transparent px-2 text-sm outline-none lg:w-64"
              />
            </div>
            <button className="rounded-2xl bg-violet-600 p-2.5 text-white shadow-sm">
              <BiSolidShoppingBag size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-violet-100 py-4 lg:hidden">
            <div className="flex items-center rounded-2xl border border-violet-200 bg-violet-50 px-3 md:hidden">
              <IoIosSearch size={18} className="text-violet-500" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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


function CategoryCard({ item }) {
  return (
    <div className="group rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-800">{item.name}</h3>
        <GrFormPrevious
          size={18}
          className="text-violet-500 transition group-hover:translate-x-1"
        />
      </div>
    </div>
  );
}



function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function Pagination() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className="rounded-xl border border-violet-200 p-2 text-violet-700">
        <MdNavigateNext size={18} />
      </button>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className={`h-10 w-10 rounded-xl text-sm font-semibold ${n === 1 ? "bg-violet-600 text-white" : "border border-violet-200 text-violet-700"}`}
        >
          {n}
        </button>
      ))}
      <button className="rounded-xl border border-violet-200 p-2 text-violet-700">
        <MdNavigateNext size={18} />
      </button>
    </div>
  );
}

function ProductDetail() {
  return (
    <section className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Chi tiết sản phẩm
      </h2>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={products[0].image}
            alt="Áo dài"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-5">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">Tên: Áo dài</h3>
            <p className="mt-2 text-sm text-slate-500">Loại: Áo</p>
          </div>
          <p className="leading-7 text-slate-600">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {products.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-violet-100 bg-violet-50 p-4"
              >
                <div className="mb-3 h-28 rounded-2xl bg-white p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div className="space-y-1 text-sm text-slate-700">
                  <p className="font-semibold">{item.name}</p>
                  <p>Size: {item.size}</p>
                  <p>Màu: {item.color}</p>
                  <p>Còn: {item.stock}</p>
                  <p>Giá gốc: {formatVND(item.price)}</p>
                  <p>Đã giảm: {formatVND(item.salePrice)}</p>
                  <p>Giảm: {item.discount}%</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    defaultValue="0"
                    className="h-10 w-20 rounded-xl border border-violet-200 bg-white px-3 outline-none"
                  />
                  <button className="flex-1 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white">
                    Thêm vào giỏ
                  </button>
                </div>
                <div className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Available
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommentsSection() {
  return (
    <section className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Bình luận</h2>
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{c.name}</h3>
              <span className="text-sm text-slate-500">{c.date}</span>
            </div>
            <p className="text-sm leading-7 text-slate-600">{c.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          Nhập nội dung:
        </label>
        <textarea className="min-h-28 w-full rounded-3xl border border-violet-200 p-4 outline-none focus:border-violet-400" />
        <button className="rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white">
          Gửi
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-violet-100 bg-white py-12">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="text-3xl font-black text-violet-700">TGSHOP</div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700 md:justify-end">
            {[
              "Hỏi đáp",
              "Chính sách",
              "Điều khoản",
              "Giới thiệu",
              "Liên hệ",
            ].map((item) => (
              <a key={item} href="#" className="hover:text-violet-700">
                {item}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [keyword]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50 text-slate-800">
      <Header
        keyword={keyword}
        setKeyword={setKeyword}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="pb-10">
        <Container className="pt-8">
          <section className="rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 p-6 text-white shadow-xl sm:p-10">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
                
              </p>
              <h1 className="text-3xl font-black sm:text-5xl">
                Bạn đang quan tâm gì?
              </h1>
              <p className="mt-4 text-sm leading-7 text-violet-50 sm:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, asperiores ducimus eos officia qui quae accusantium dolorum praesentium excepturi inventore, totam libero maxime ab itaque.
              </p>
            </div>
          </section>
        </Container>

        <Container className="mt-12">
          <SectionHeader title="Bạn đang quan tâm gì?" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </div>
        </Container>
          
        <EventSection></EventSection>
        <HotProductSection></HotProductSection>
        <HotProductSection></HotProductSection>

        {/* <Container className="mt-12">
          <SectionHeader title="Sản phẩm mới!" />
          <ProductGrid items={filteredProducts.slice(5, 10)} />
        </Container> */}

        {/* <Container className="mt-12">
          <div className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader title="Kết quả tìm kiếm" action="Thu gọn" />
            <ProductGrid items={filteredProducts} />
            <Pagination />
          </div>
        </Container> */}

        {/* <Container className="mt-12">
          <div className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader title="Chi tiết sự kiện" action="Thu gọn" />
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="h-80 rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500" />
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-900">
                  Chào xuân 2026
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full bg-rose-100 px-4 py-2 font-bold text-rose-600">
                    15% OFF
                  </span>
                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Available
                  </span>
                </div>
                <div className="grid gap-2 text-slate-600 sm:grid-cols-2">
                  <p>Từ: 10/01/2026</p>
                  <p>Tới: 10/03/2026</p>
                </div>
                <p className="leading-7 text-slate-600">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable.
                </p>
              </div>
            </div>
          </div>
        </Container> */}

        {/* <Container className="mt-12">
          <ProductDetail />
        </Container>

        <Container className="mt-12">
          <CommentsSection />
        </Container> */}
      </main>

      <Footer />
    </div>
  );
}
