import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import RefundModal from "../../components/storefront/RefundModal";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import Skeleton from "../../components/common/Skeleton";
import { formatVND, formatDate, resolveImageUrl } from "../../utils/formatters";
import { FiRotateCcw } from "react-icons/fi";

export const BoughtItemsPage = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Refund Modal state
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchBoughtItems = async () => {
    try {
      setLoading(true);
      const res = await orderService.getBoughtItems({ page, size: 8 });
      const pageData = res?.data;
      if (pageData) {
        setItems(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load bought items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoughtItems();
  }, [page]);

  const handleOpenRefund = (item) => {
    setSelectedItem(item);
    setRefundModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF]">
        <h2 className="font-editorial text-2xl font-medium text-[#121316]">
          Sản Phẩm Đã Mua
        </h2>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Danh sách các sản phẩm từ đơn hàng đã thanh toán hoặc đã giao. Bạn có thể gửi yêu cầu đổi trả tại đây.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-24 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#E6E4DF] p-12 text-center rounded-[2px]">
          <h4 className="font-editorial text-lg font-medium text-[#121316] mb-1">
            Chưa có sản phẩm đủ điều kiện đổi trả
          </h4>
          <p className="text-xs text-[#6B706E]">
            Các sản phẩm đã mua và thanh toán thành công sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#E6E4DF] bg-white border border-[#E6E4DF] rounded-[2px] px-6">
          {items.map((item, idx) => {
            const img = item.productImg || item.img;
            return (
              <div
                key={item.orderItemId || item.id || idx}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={resolveImageUrl(img)}
                    alt={item.productName}
                    className="w-16 h-20 object-cover bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px] shrink-0"
                  />
                  <div>
                    <h5 className="text-sm font-medium text-[#121316]">
                      {item.productName || "Sản phẩm may mặc"}
                    </h5>
                    <p className="text-xs text-[#6B706E] mt-0.5">
                      Màu: {item.color || "—"} · Size: {item.size || "—"} · Số lượng mua: {item.quantity}
                    </p>
                    <p className="font-mono text-xs font-semibold text-[#121316] mt-1.5">
                      {formatVND(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between gap-2">
                  {item.createdAt && (
                    <span className="text-[11px] text-[#6B706E]">
                      Mua ngày: {formatDate(item.createdAt)}
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiRotateCcw}
                    onClick={() => handleOpenRefund(item)}
                  >
                    Yêu cầu đổi / trả
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="py-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

      {/* Refund Modal */}
      <RefundModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        item={selectedItem}
        onSuccess={() => {
          fetchBoughtItems();
        }}
      />
    </div>
  );
};

export default BoughtItemsPage;

