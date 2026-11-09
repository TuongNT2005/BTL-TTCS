import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import { useUI } from "../../context/UIContext";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import Skeleton from "../../components/common/Skeleton";
import { formatVND, resolveImageUrl } from "../../utils/formatters";
import { FiPlus, FiEdit2, FiSearch } from "react-icons/fi";

const CATEGORIES = ["Sơ mi", "Quần", "Áo khoác", "Phụ kiện", "Váy"];

export const ProductsManagePage = () => {
  const { showToast } = useUI();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "Sơ mi",
    description: "",
    price: "",
    originalPrice: "",
    img: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        page,
        size: 10,
        productName: keyword,
      });

      const pageData = res?.data;
      if (pageData) {
        setProducts(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Sơ mi",
      description: "",
      price: "",
      originalPrice: "",
      img: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || "",
      category: p.category || "Sơ mi",
      description: p.description || "",
      price: p.price != null ? String(p.price) : "",
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
      img: p.img || p.image || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        img: formData.img.trim() || null,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        showToast("Cập nhật thông tin sản phẩm thành công!", "success");
      } else {
        await productService.createProduct(payload);
        showToast("Tạo sản phẩm mới thành công!", "success");
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Thao tác thất bại";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-medium text-[#121316]">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-xs text-[#6B706E] mt-0.5">
            Danh mục các thiết kế may mặc trong hệ thống.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={handleOpenCreate}
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-2 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
          />
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3 w-16">Ảnh</th>
                <th className="px-6 py-3">Tên sản phẩm</th>
                <th className="px-6 py-3">Danh mục</th>
                <th className="px-6 py-3">Giá bán</th>
                <th className="px-6 py-3">Giá gốc</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#6B706E]">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#6B706E]">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                    <td className="px-6 py-3">
                      <img
                        src={resolveImageUrl(p.img || p.image)}
                        alt={p.name}
                        className="w-10 h-13 object-cover rounded-[2px] border border-[#E6E4DF] bg-[#F9F9F8]"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium text-[#121316] max-w-xs truncate">
                      {p.name}
                    </td>
                    <td className="px-6 py-3 text-[#6B706E]">
                      {p.category || "—"}
                    </td>
                    <td className="px-6 py-3 font-mono font-medium text-[#121316]">
                      {formatVND(p.price)}
                    </td>
                    <td className="px-6 py-3 font-mono text-[#6B706E]">
                      {p.originalPrice ? formatVND(p.originalPrice) : "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-[#121316] hover:text-[#6B706E] border border-[#E6E4DF] rounded-[2px] hover:border-[#121316] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                      >
                        <FiEdit2 className="w-3 h-3" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-[#E6E4DF]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Cập Nhật Sản Phẩm" : "Thêm Thiết Kế Mới"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Tên sản phẩm"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Áo Sơ Mi Lụa Dệt Tự Nhiên"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Danh mục"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              options={CATEGORIES}
            />

            <Input
              label="Link hình ảnh (URL)"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
              placeholder="https://... hoặc tên file ảnh"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Giá bán (VND)"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="1250000"
            />
            <Input
              label="Giá gốc (nếu có giảm giá)"
              type="number"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData({ ...formData, originalPrice: e.target.value })
              }
              placeholder="1500000"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#121316]">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Chất liệu, đường may, form dáng, cách bảo quản..."
              className="w-full text-sm bg-white border border-[#E6E4DF] rounded-[2px] p-2.5 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E4DF] mt-2">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsManagePage;

