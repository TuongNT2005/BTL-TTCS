import React, { useState } from "react";
import refundService from "../../services/refundService";
import { useUI } from "../../context/UIContext";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { formatVND } from "../../utils/formatters";

export const RefundModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { showToast } = useUI();
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const maxQuantity = item.quantity || 1;
  const orderItemId = item.orderItemId || item.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast("Vui lòng nêu rõ lý do đổi/trả sản phẩm", "error");
      return;
    }

    try {
      setSubmitting(true);
      await refundService.createRefundRequest({
        orderItemId,
        quantity: Number(quantity),
        reason,
        imageUrl: imageUrl.trim() || null,
      });

      showToast("Gửi yêu cầu đổi trả thành công!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Không thể gửi yêu cầu";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yêu Cầu Đổi / Trả Sản Phẩm"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Item Summary */}
        <div className="bg-[#F9F9F8] border border-[#E6E4DF] p-3.5 rounded-[2px] flex items-center justify-between text-xs">
          <div>
            <p className="font-medium text-[#121316]">
              {item.productName || "Sản phẩm"}
            </p>
            <p className="text-[#6B706E] mt-0.5">
              Màu: {item.color || "—"} · Size: {item.size || "—"}
            </p>
          </div>
          <span className="font-mono font-medium text-[#121316]">
            {formatVND(item.price)}
          </span>
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#121316]">
            Số lượng hoàn trả (Tối đa: {maxQuantity})
          </label>
          <input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full text-sm bg-white border border-[#E6E4DF] rounded-[2px] p-2.5 text-[#121316] focus:outline-none focus:border-[#121316]"
            required
          />
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#121316]">
            Lý do đổi/trả <span className="text-[#8C2B2B]">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Mô tả chi tiết tình trạng (ví dụ: Không vừa size, lỗi đường may, sai màu...)"
            className="w-full text-sm bg-white border border-[#E6E4DF] rounded-[2px] p-2.5 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
            required
          />
        </div>

        {/* Image URL optional */}
        <Input
          label="Link hình ảnh minh chứng (nếu có)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://... hoặc đường dẫn ảnh chụp"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E4DF] mt-2">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RefundModal;

