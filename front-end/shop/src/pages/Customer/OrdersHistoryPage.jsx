import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import { useUI } from "../../context/UIContext";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Skeleton from "../../components/common/Skeleton";
import {
  formatVND,
  formatDateTime,
  getOrderStatusMeta,
  resolveImageUrl,
} from "../../utils/formatters";

const STATUS_TABS = [
  { key: "", label: "Tất cả" },
  { key: "PENDING", label: "Chờ thanh toán" },
  { key: "PAID", label: "Đã thanh toán" },
  { key: "DELIVERIED", label: "Đã giao hàng" },
  { key: "CANCEL", label: "Đã hủy" },
];

export const OrdersHistoryPage = () => {
  const { showToast } = useUI();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Processing state
  const [processingId, setProcessingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders({
        status: selectedStatus,
        page,
        size: 8,
      });

      const pageData = res?.data;
      if (pageData) {
        setOrders(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, page]);

  const handlePayOrder = async (orderId) => {
    try {
      setProcessingId(orderId);
      await orderService.payOrder(orderId);
      showToast("Thanh toán đơn hàng thành công!", "success");
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Thanh toán thất bại";
      showToast(msg, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này? Xu thưởng đã dùng sẽ được hoàn trả.")) {
      return;
    }
    try {
      setProcessingId(orderId);
      await orderService.cancelOrder(orderId);
      showToast("Đã hủy đơn hàng thành công!", "success");
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Hủy đơn hàng thất bại";
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
        <h2 className="font-editorial text-2xl font-medium text-[#121316]">
          Đơn Hàng Của Tôi
        </h2>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Theo dõi tiến độ xử lý, lịch sử thanh toán và trạng thái vận chuyển.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E6E4DF]">
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedStatus(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#121316] text-white"
                  : "text-[#6B706E] hover:text-[#121316] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-36 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#E6E4DF] p-12 text-center rounded-[2px]">
          <h4 className="font-editorial text-lg font-medium text-[#121316] mb-1">
            Chưa có đơn hàng nào
          </h4>
          <p className="text-xs text-[#6B706E]">
            {selectedStatus
              ? "Không có đơn hàng nào ở trạng thái này."
              : "Bạn chưa đặt mua đơn hàng nào tại ATELIER."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const statusMeta = getOrderStatusMeta(order.status);
            const isPending = order.status === "PENDING";
            const orderId = order.id || order.orderId;

            return (
              <div
                key={orderId}
                className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex flex-col gap-4 hover:border-[#6B706E] transition-colors"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6E4DF]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#121316]">
                      #ORD-{orderId}
                    </span>
                    <span className="text-xs text-[#6B706E]">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-medium border rounded-[2px] ${statusMeta.classes}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Body Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#6B706E] block">Người nhận:</span>
                    <span className="font-medium text-[#121316]">
                      {order.receiverName || order.name || "—"} ({order.phone || "—"})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B706E] block">Địa chỉ giao:</span>
                    <span className="font-medium text-[#121316] truncate block">
                      {order.address || "—"}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[#6B706E] block">Xu đã dùng:</span>
                    <span className="font-mono text-[#B45309]">
                      {(order.coinUsed || 0).toLocaleString()} xu
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E4DF]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(orderId)}
                      className="text-xs font-medium underline text-[#121316] hover:text-[#6B706E] cursor-pointer"
                    >
                      Xem chi tiết sản phẩm
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {isPending && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#8C2B2B] hover:bg-[#FEF2F2]"
                          loading={processingId === orderId}
                          onClick={() => handleCancelOrder(orderId)}
                        >
                          Hủy đơn
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          loading={processingId === orderId}
                          onClick={() => handlePayOrder(orderId)}
                        >
                          Thanh toán ngay
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={orderDetail ? `Chi Tiết Đơn Hàng #ORD-${orderDetail.id}` : "Chi Tiết Đơn Hàng"}
        maxWidth="max-w-2xl"
      >
        {loadingDetail || !orderDetail ? (
          <div className="py-8 text-center text-xs text-[#6B706E]">
            Đang tải chi tiết đơn hàng...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Status & Timing */}
            <div className="flex justify-between items-center bg-[#F9F9F8] p-3.5 rounded-[2px] border border-[#E6E4DF] text-xs">
              <div>
                <span className="text-[#6B706E] block">Ngày đặt:</span>
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

            {/* Recipient Details */}
            <div className="text-xs space-y-1.5 border-b border-[#E6E4DF] pb-4">
              <div className="flex justify-between">
                <span className="text-[#6B706E]">Người nhận:</span>
                <span className="font-medium text-[#121316]">
                  {orderDetail.receiverName || orderDetail.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B706E]">Điện thoại:</span>
                <span className="font-mono text-[#121316]">{orderDetail.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B706E]">Địa chỉ nhận hàng:</span>
                <span className="font-medium text-[#121316] max-w-sm text-right">
                  {orderDetail.address}
                </span>
              </div>
            </div>

            {/* Items list */}
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

            {/* Price Calculations */}
            <div className="pt-3 border-t border-[#E6E4DF] text-xs space-y-1.5">
              <div className="flex justify-between text-[#6B706E]">
                <span>Xu đã khấu trừ:</span>
                <span className="font-mono text-[#B45309]">
                  -{(orderDetail.coinUsed || 0).toLocaleString()} xu
                </span>
              </div>
              {orderDetail.paidAt && (
                <div className="flex justify-between text-[#047857]">
                  <span>Thời gian thanh toán:</span>
                  <span>{formatDateTime(orderDetail.paidAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersHistoryPage;

