import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../../services/productService";
import ProductCard from "../../components/storefront/ProductCard";
import Pagination from "../../components/common/Pagination";
import Skeleton from "../../components/common/Skeleton";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const CATEGORIES = ["Tất cả", "Sơ mi", "Quần", "Áo khoác", "Phụ kiện", "Váy"];

export const ProductCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "Tất cả";

  const [keyword, setKeyword] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState("id-desc");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "Tất cả";
    setKeyword(q);
    setSelectedCategory(cat);
    setPage(1);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let sortBy = ["id"];
      let sortDir = ["desc"];

      if (sortOption === "id-desc") {
        sortBy = ["id"];
        sortDir = ["desc"];
      } else if (sortOption === "name-asc") {
        sortBy = ["name"];
        sortDir = ["asc"];
      } else if (sortOption === "name-desc") {
        sortBy = ["name"];
        sortDir = ["desc"];
      }

      const res = await productService.getProducts({
        page,
        size: 12,
        productName: keyword,
        category: selectedCategory === "Tất cả" ? "" : selectedCategory,
        sortBy,
        sortDir,
      });

      const pageData = res?.data;
      if (pageData) {
        setProducts(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || (pageData.content?.length ?? 0));
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (keyword) newParams.set("q", keyword);
    else newParams.delete("q");
    setSearchParams(newParams);
    fetchProducts();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== "Tất cả") newParams.set("category", cat);
    else newParams.delete("category");
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E6E4DF] gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-[#6B706E] uppercase tracking-wider block mb-1">
            Tuyển Tập Sản Phẩm
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#121316]">
            {selectedCategory === "Tất cả" ? "Tất Cả Thiết Kế" : `Bộ Sưu Tập ${selectedCategory}`}
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#6B706E]">
          <span>
            Hiển thị <span className="font-mono text-[#121316] font-medium">{totalElements}</span> sản phẩm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-8 py-2.5 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
            />
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  const p = new URLSearchParams(searchParams);
                  p.delete("q");
                  setSearchParams(p);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B706E] hover:text-[#121316]"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Categories */}
          <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex flex-col gap-3">
            <span className="text-xs font-medium text-[#121316] uppercase tracking-wider pb-2 border-b border-[#E6E4DF]">
              Danh Mục Trang Phục
            </span>
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-xs text-left py-1.5 px-2 rounded-[2px] transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#121316] text-white font-medium"
                        : "text-[#121316] hover:bg-[#F9F9F8]"
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="text-[10px]">●</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex flex-col gap-3">
            <span className="text-xs font-medium text-[#121316] uppercase tracking-wider pb-2 border-b border-[#E6E4DF]">
              Thứ Tự Sắp Xếp
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px] p-2 text-[#121316] focus:outline-none focus:border-[#121316]"
            >
              <option value="id-desc">Mới nhất (Mặc định)</option>
              <option value="name-asc">Tên sản phẩm: A → Z</option>
              <option value="name-desc">Tên sản phẩm: Z → A</option>
            </select>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <section className="lg:col-span-3 flex flex-col">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#E6E4DF] p-12 text-center rounded-[2px] flex flex-col items-center justify-center">
              <span className="font-editorial text-xl font-medium text-[#121316] mb-1">
                Không tìm thấy mẫu thiết kế phù hợp
              </span>
              <p className="text-xs text-[#6B706E] mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
              </p>
              <button
                onClick={() => {
                  setKeyword("");
                  setSelectedCategory("Tất cả");
                  setSearchParams({});
                }}
                className="text-xs underline text-[#121316] cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductCatalogPage;

