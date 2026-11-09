import React, { useState, useEffect } from "react";
import refundService from "../../services/refundService";
import Pagination from "../../components/common/Pagination";
import Skeleton from "../../components/common/Skeleton";
import {
  formatDateTime,
  getRefundStatusMeta,
  resolveImageUrl,
} from "../../utils/formatters";

export const MyRefundRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      const res = await refundService.getMyRefundRequests({ page, size: 8 });
      const pageData = res?.data;
      if (pageData) {
        setRequests(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load refund requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundRequests();
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF]">
        <h2 className="font-editorial text-2xl font-medium text-[#121316]">
          Tiến Độ Đổi / Trả Hàng
        </h2>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Theo dõi trạng thái xét duyệt và hoàn xu từ đội ngũ chăm sóc khách hàng.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-28 w-full" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-[#E6E4DF] p-12 text-center rounded-[2px]">
          <h4 className="font-editorial text-lg font-medium text-[#121316] mb-1">
            Chưa có yêu cầu đổi trả nào
          </h4>
          <p className="text-xs text-[#6B706E]">
            Khi bạn gửi yêu cầu đổi trả cho sản phẩm đã mua, tiến độ sẽ được cập nhật tại đây.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => {
            const statusMeta = getRefundStatusMeta(req.status);
            return (
              <div
                key={req.id}
                className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex flex-col gap-3.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DF]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#121316]">
                      #REQ-{req.id}
                    </span>
                    <span className="text-xs text-[#6B706E]">
                      {formatDateTime(req.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-medium border rounded-[2px] ${statusMeta.classes}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
                  <div className="flex-1">
                    <p className="font-medium text-[#121316] mb-1">
                      {req.productName || "Sản phẩm đổi trả"}
                    </p>
                    <p className="text-[#6B706E]">
                      Số lượng yêu cầu hoàn: <span className="font-semibold text-[#121316]">{req.quantity}</span> chiếc
                    </p>
                    <p className="text-[#6B706E] mt-1.5 bg-[#F9F9F8] p-2.5 rounded-[2px] border border-[#E6E4DF]">
                      Lý do: <span className="text-[#121316]">{req.reason}</span>
                    </p>
                  </div>

                  {req.imageUrl && (
                    <img
                      src={resolveImageUrl(req.imageUrl)}
                      alt="Minh chứng"
                      className="w-16 h-16 object-cover border border-[#E6E4DF] rounded-[2px] shrink-0"
                    />
                  )}
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
    </div>
  );
};

export default MyRefundRequestsPage;

