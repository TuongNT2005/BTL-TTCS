import React, { useState, useEffect } from "react";
import productVariantService from "../../services/productVariantService";
import productService from "../../services/productService";
import { useUI } from "../../context/UIContext";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { formatVND } from "../../utils/formatters";
import { FiPlus, FiEdit2, FiSearch, FiAlertTriangle } from "react-icons/fi";

const SIZES = ["S", "M", "L", "XL", "XXL", "Free"];

export const WarehouseManagePage = () => {
  const { showToast } = useUI();
  const [variants, setVariants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  // Products list for selecting in import modal
  const [allProducts, setAllProducts] = useState([]);

  // Modal states
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Import form state
  const [importData, setImportData] = useState({
    productId: "",
    color: "",
    size: "M",
    quantity: "",
    price: "",
  });

  // Edit form state
  const [editData, setEditData] = useState({
    color: "",
    size: "M",
    quantity: "",
    price: "",
  });

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const res = await productVariantService.getVariants({
        page,
        size: 10,
        productName: searchName,
      });

      const pageData = res?.data;
      if (pageData) {
        setVariants(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load variants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [page]);

  useEffect(() => {
    // Load products for dropdown
    const loadProducts = async () => {
      try {
        const res = await productService.getProducts({ size: 100 });
        const list = res?.data?.content || res?.data || [];
        setAllProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load products for import", err);
      }
    };
    loadProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVariants();
  };

  const handleOpenImport = () => {
    setImportData({
      productId: allProducts[0]?.id || "",
      color: "Đen",
      size: "M",
      quantity: 10,
      price: 500000,
    });
    setImportModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setSelectedVariant(v);
    setEditData({
      color: v.color || "",
      size: v.size || "M",
      quantity: v.quantity != null ? String(v.quantity) : "0",
      price: v.price != null ? String(v.price) : "",
    });
    setEditModalOpen(true);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importData.productId) {
      showToast("Vui lòng chọn sản phẩm", "error");
      return;
    }

    try {
      setSubmitting(true);
      await productVariantService.importVariant(importData.productId, {
        color: importData.color.trim(),
        size: importData.size,
        quantity: Number(importData.quantity) || 1,
        price: Number(importData.price) || 0,
      });

      showToast("Nhập kho biến thể thành công!", "success");
      setImportModalOpen(false);
      fetchVariants();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Nhập kho thất bại";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVariant) return;

    try {
      setSubmitting(true);
      await productVariantService.updateVariant(selectedVariant.id, {
        color: editData.color.trim(),
        size: editData.size,
        quantity: Number(editData.quantity) || 0,
        price: Number(editData.price) || 0,
      });

      showToast("Cập nhật biến thể thành công!", "success");
      setEditModalOpen(false);
      fetchVariants();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Cập nhật thất bại";
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
            Quản Lý Biến Thể &amp; Tồn Kho
          </h1>
          <p className="text-xs text-[#6B706E] mt-0.5">
            Theo dõi ma trận Màu / Size và thực hiện nhập xuất kho sản phẩm.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={handleOpenImport}
        >
          Nhập kho biến thể
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-2 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
          />
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
        </form>
      </div>

      {/* Variants Table */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3">Mã SKU</th>
                <th className="px-6 py-3">Tên sản phẩm</th>
                <th className="px-6 py-3">Màu sắc</th>
                <th className="px-6 py-3">Kích cỡ</th>
                <th className="px-6 py-3">Tồn kho</th>
                <th className="px-6 py-3">Giá bán</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Đang tải dữ liệu kho...
                  </td>
                </tr>
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Chưa có biến thể nào trong kho.
                  </td>
                </tr>
              ) : (
                variants.map((v) => {
                  const stock = v.quantity ?? v.stock ?? 0;
                  return (
                    <tr key={v.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                        #SKU-{v.id}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-[#121316]">
                        {v.productName || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-[#121316]">
                        {v.color || "—"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[#121316]">
                        {v.size || "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        {stock <= 0 ? (
                          <span className="inline-flex items-center gap-1 text-[#8C2B2B] font-medium">
                            <FiAlertTriangle className="w-3 h-3" />
                            Hết hàng (0)
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 text-[#B45309] font-medium">
                            <FiAlertTriangle className="w-3 h-3" />
                            Sắp hết ({stock})
                          </span>
                        ) : (
                          <span className="text-[#047857] font-mono">
                            {stock} chiếc
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 font-mono font-medium text-[#121316]">
                        {formatVND(v.price)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 text-[#121316] hover:text-[#6B706E] border border-[#E6E4DF] rounded-[2px] hover:border-[#121316] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                        >
                          <FiEdit2 className="w-3 h-3" />
                          <span>Chỉnh sửa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
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

      {/* Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Nhập Kho Biến Thể Sản Phẩm"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleImportSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#121316]">
              Chọn sản phẩm áp dụng <span className="text-[#8C2B2B]">*</span>
            </label>
            <select
              value={importData.productId}
              onChange={(e) =>
                setImportData({ ...importData, productId: e.target.value })
              }
              className="text-xs bg-white border border-[#E6E4DF] rounded-[2px] p-2.5 text-[#121316] focus:outline-none focus:border-[#121316]"
              required
            >
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (#{p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Màu sắc"
              required
              value={importData.color}
              onChange={(e) =>
                setImportData({ ...importData, color: e.target.value })
              }
              placeholder="Đen, Trắng, Be..."
            />
            <Select
              label="Kích cỡ"
              value={importData.size}
              onChange={(e) =>
                setImportData({ ...importData, size: e.target.value })
              }
              options={SIZES}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lượng nhập"
              type="number"
              min={1}
              required
              value={importData.quantity}
              onChange={(e) =>
                setImportData({ ...importData, quantity: e.target.value })
              }
              placeholder="10"
            />
            <Input
              label="Giá bán (VND)"
              type="number"
              min={0}
              required
              value={importData.price}
              onChange={(e) =>
                setImportData({ ...importData, price: e.target.value })
              }
              placeholder="500000"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E4DF] mt-2">
            <Button
              variant="ghost"
              onClick={() => setImportModalOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Xác nhận nhập kho
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Variant Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Chỉnh Sửa Biến Thể &amp; Tồn Kho"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Màu sắc"
              required
              value={editData.color}
              onChange={(e) =>
                setEditData({ ...editData, color: e.target.value })
              }
            />
            <Select
              label="Kích cỡ"
              value={editData.size}
              onChange={(e) =>
                setEditData({ ...editData, size: e.target.value })
              }
              options={SIZES}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tồn kho"
              type="number"
              min={0}
              required
              value={editData.quantity}
              onChange={(e) =>
                setEditData({ ...editData, quantity: e.target.value })
              }
            />
            <Input
              label="Giá bán (VND)"
              type="number"
              min={0}
              required
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E4DF] mt-2">
            <Button
              variant="ghost"
              onClick={() => setEditModalOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WarehouseManagePage;

