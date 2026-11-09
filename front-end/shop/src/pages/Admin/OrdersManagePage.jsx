import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import { useUI } from "../../context/UIContext";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import {
  formatVND,
  formatDateTime,
  getOrderStatusMeta,
} from "../../utils/formatters";
import { FiSearch, FiTruck, FiEye } from "react-icons/fi";

const STATUS_FILTERS = [
  { key: "", label: "Tất cả trạng thái" },
  { key: "PENDING", label: "Chờ thanh toán" },
  { key: "PAID", label: "Đã thanh toán (Chờ giao)" },
  { key: "DELIVERIED", label: "Đã giao hàng" },
  { key: "CANCEL", label: "Đã hủy" },
];

export const OrdersManagePage = () => {
  const { showToast } = useUI();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Action processing
  const [processingId, setProcessingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.searchOrdersAdmin({
        page,
        size: 10,
        status: selectedStatus,
        receiverName: searchName,
      });

      const pageData = res?.data;
      if (pageData) {
        setOrders(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      setProcessingId(orderId);
      await orderService.confirmDelivery(orderId);
      showToast("Đã cập nhật trạng thái: ĐÃ GIAO HÀNG!", "success");
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể cập nhật";
      showToast(msg, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      setLoadingDetail(true);
      setDetailModalOpen(true);
      const res = await orderService.getOrderDetail(orderId);
      setOrderDetail(res?.data);
    } catch (err) {
      showToast("Không thể tải chi tiết đơn hàng", "error");
      setDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF]">
        <h1 className="font-editorial text-2xl font-medium text-[#121316]">
          Quản Lý Đơn Hàng
        </h1>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Tra cứu, theo dõi tiến độ và xác nhận giao hàng cho các đơn hàng trong hệ thống.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm theo tên người nhận..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-2 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
          />
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
        </form>

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          className="text-xs bg-white border border-[#E6E4DF] rounded-[2px] px-3 py-2 text-[#121316] focus:outline-none focus:border-[#121316] w-full sm:w-auto"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Người nhận</th>
                <th className="px-6 py-3">Điện thoại</th>
                <th className="px-6 py-3">Địa chỉ</th>
                <th className="px-6 py-3">Ngày đặt</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Không có đơn hàng nào khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const statusMeta = getOrderStatusMeta(ord.status);
                  const isPaid = ord.status === "PAID";

                  return (
                    <tr key={ord.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-medium text-[#121316]">
                        #ORD-{ord.id}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-[#121316]">
                        {ord.receiverName || ord.name || "—"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                        {ord.phone || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-[#6B706E] max-w-xs truncate">
                        {ord.address || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-[#6B706E]">
                        {formatDateTime(ord.createdAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-[2px] ${statusMeta.classes}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(ord.id)}
                          className="p-1.5 text-[#121316] hover:text-[#6B706E] border border-[#E6E4DF] rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                          title="Xem chi tiết"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>

                        {isPaid && (
                          <button
                            onClick={() => handleConfirmDelivery(ord.id)}
                            disabled={processingId === ord.id}
                            className="p-1.5 bg-[#047857] text-white hover:bg-[#065F46] rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                            title="Xác nhận đã giao hàng"
                          >
                            <FiTruck className="w-3.5 h-3.5" />
                            <span>Giao hàng</span>
                          </button>
                        )}
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

      {/* Order Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={orderDetail ? `Chi Tiết Đơn Hàng #ORD-${orderDetail.id}` : "Chi Tiết Đơn Hàng"}
        maxWidth="max-w-2xl"
      >
        {loadingDetail || !orderDetail ? (
          <div className="py-8 text-center text-xs text-[#6B706E]">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-[#F9F9F8] p-3.5 rounded-[2px] border border-[#E6E4DF] text-xs">
              <div>
                <span className="text-[#6B706E] block">Thời gian tạo:</span>
                <span className="font-medium text-[#121316]">
                  {formatDateTime(orderDetail.createdAt)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#6B706E] block">Trạng thái:</span>
                <span className="font-semibold text-[#121316]">
                  {getOrderStatusMeta(orderDetail.status).label}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 border-b border-[#E6E4DF] pb-4">
              <div className="flex justify-between">
                <span className="text-[#6B706E]">Người nhận:</span>
                <span className="font-medium text-[#121316]">
                  {orderDetail.receiverName || orderDetail.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B706E]">Số điện thoại:</span>
                <span className="font-mono text-[#121316]">{orderDetail.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B706E]">Địa chỉ:</span>
                <span className="font-medium text-[#121316] max-w-sm text-right">
                  {orderDetail.address}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#121316] uppercase tracking-wider block mb-3">
                Danh Sách Sản Phẩm
              </span>
              <div className="flex flex-col divide-y divide-[#E6E4DF]">
                {(orderDetail.orderItems || orderDetail.items || []).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-[#121316]">
                        {item.productName || item.productVariantName || "Sản phẩm"}
                      </p>
                      <p className="text-[#6B706E] mt-0.5">
                        Màu: {item.color || "—"} · Size: {item.size || "—"} · SL: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-medium text-[#121316]">
                      {formatVND((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersManagePage;

