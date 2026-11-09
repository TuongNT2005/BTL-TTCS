import React, { useState, useEffect } from "react";
import refundService from "../../services/refundService";
import { useUI } from "../../context/UIContext";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import {
  formatDateTime,
  getRefundStatusMeta,
  resolveImageUrl,
} from "../../utils/formatters";
import { FiCheck, FiX, FiCheckCircle, FiEye } from "react-icons/fi";

const STATUS_FILTERS = [
  { key: "", label: "Tất cả" },
  { key: "PENDING", label: "Đang chờ duyệt" },
  { key: "ACCEPTED", label: "Đã chấp nhận" },
  { key: "DONE", label: "Đã hoàn tất" },
  { key: "REJECTED", label: "Từ chối" },
];

export const RefundsManagePage = () => {
  const { showToast } = useUI();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      const res = await refundService.searchRefundRequestsAdmin({
        page,
        size: 10,
        status: selectedStatus,
      });

      const pageData = res?.data;
      if (pageData) {
        setRequests(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load admin refunds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundRequests();
  }, [page, selectedStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await refundService.updateRefundStatus(id, { status: newStatus });
      showToast(`Đã chuyển trạng thái yêu cầu sang ${newStatus}!`, "success");
      setModalOpen(false);
      fetchRefundRequests();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể cập nhật";
      showToast(msg, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenReview = (req) => {
    setSelectedRequest(req);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF]">
        <h1 className="font-editorial text-2xl font-medium text-[#121316]">
          Duyệt Yêu Cầu Đổi / Trả Hàng
        </h1>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Xem xét minh chứng và phê duyệt hoàn xu / phục hồi tồn kho cho khách hàng.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E6E4DF]">
        {STATUS_FILTERS.map((tab) => {
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

      {/* Table */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3">Mã</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Sản phẩm</th>
                <th className="px-6 py-3">Số lượng</th>
                <th className="px-6 py-3">Ngày gửi</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Đang tải danh sách yêu cầu...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Không có yêu cầu đổi trả nào.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const statusMeta = getRefundStatusMeta(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                        #REQ-{req.id}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-[#121316]">
                        {req.username || `User #${req.userId}`}
                      </td>
                      <td className="px-6 py-3.5 text-[#121316] max-w-xs truncate">
                        {req.productName || "Sản phẩm"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[#121316]">
                        {req.quantity}
                      </td>
                      <td className="px-6 py-3.5 text-[#6B706E]">
                        {formatDateTime(req.createdAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-[2px] ${statusMeta.classes}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenReview(req)}
                          className="p-1.5 text-[#121316] hover:text-[#6B706E] border border-[#E6E4DF] rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Xem xét</span>
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

      {/* Review & Approve Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedRequest ? `Xét Duyệt Yêu Cầu #REQ-${selectedRequest.id}` : "Xét Duyệt"}
        maxWidth="max-w-lg"
      >
        {selectedRequest && (
          <div className="flex flex-col gap-5 text-xs">
            <div className="flex justify-between items-center bg-[#F9F9F8] p-3 rounded-[2px] border border-[#E6E4DF]">
              <span>Khách hàng: <strong className="text-[#121316]">{selectedRequest.username}</strong></span>
              <span className={`px-2 py-0.5 border rounded-[2px] ${getRefundStatusMeta(selectedRequest.status).classes}`}>
                {getRefundStatusMeta(selectedRequest.status).label}
              </span>
            </div>

            <div className="space-y-1.5">
              <p><span className="text-[#6B706E]">Sản phẩm:</span> <strong className="text-[#121316]">{selectedRequest.productName}</strong></p>
              <p><span className="text-[#6B706E]">Số lượng hoàn:</span> <strong className="text-[#121316]">{selectedRequest.quantity}</strong> chiếc</p>
              <p><span className="text-[#6B706E]">Lý do từ khách hàng:</span></p>
              <div className="bg-[#F9F9F8] border border-[#E6E4DF] p-3 rounded-[2px] text-[#121316] leading-relaxed">
                {selectedRequest.reason}
              </div>
            </div>

            {selectedRequest.imageUrl && (
              <div className="space-y-1">
                <span className="text-[#6B706E]">Ảnh đính kèm từ khách:</span>
                <img
                  src={resolveImageUrl(selectedRequest.imageUrl)}
                  alt="Ảnh minh chứng"
                  className="w-full max-h-56 object-cover border border-[#E6E4DF] rounded-[2px]"
                />
              </div>
            )}

            {/* Decision Buttons */}
            <div className="pt-4 border-t border-[#E6E4DF] flex flex-wrap items-center justify-end gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                disabled={updating}
              >
                Đóng
              </Button>

              {selectedRequest.status === "PENDING" && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={FiX}
                    loading={updating}
                    onClick={() => handleUpdateStatus(selectedRequest.id, "REJECTED")}
                  >
                    Từ chối
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={FiCheck}
                    loading={updating}
                    onClick={() => handleUpdateStatus(selectedRequest.id, "ACCEPTED")}
                  >
                    Chấp nhận (ACCEPTED)
                  </Button>
                </>
              )}

              {selectedRequest.status === "ACCEPTED" && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={FiCheckCircle}
                  loading={updating}
                  onClick={() => handleUpdateStatus(selectedRequest.id, "DONE")}
                  className="bg-[#047857] hover:bg-[#065F46] border-[#047857]"
                >
                  Hoàn tất &amp; Phục hồi kho (DONE)
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RefundsManagePage;

