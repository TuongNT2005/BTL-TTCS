// Formatters & Helpers for Sartorial Apparel Storefront & Admin

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const formatVND = (amount) => {
  if (amount == null || isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(d);
  } catch {
    return String(dateString);
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  } catch {
    return String(dateString);
  }
};

export const resolveImageUrl = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/")) return `${API_BASE_URL}${img}`;
  return `${API_BASE_URL}/uploads/${img}`;
};

export const getOrderStatusMeta = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return {
        label: "Chờ thanh toán",
        classes: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
      };
    case "PAID":
      return {
        label: "Đã thanh toán",
        classes: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
      };
    case "DELIVERIED":
    case "DELIVERED":
      return {
        label: "Đã giao hàng",
        classes: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
      };
    case "CANCEL":
    case "CANCELLED":
      return {
        label: "Đã hủy",
        classes: "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
      };
    case "EXPRIED":
    case "EXPIRED":
      return {
        label: "Hết hạn",
        classes: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
      };
    default:
      return {
        label: status || "Không xác định",
        classes: "bg-[#F9FAFB] text-[#374151] border-[#E5E7EB]"
      };
  }
};

export const getRefundStatusMeta = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return {
        label: "Đang chờ duyệt",
        classes: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
      };
    case "ACCEPTED":
      return {
        label: "Đã chấp nhận",
        classes: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        classes: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]"
      };
    case "DONE":
      return {
        label: "Đã hoàn tất",
        classes: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
      };
    default:
      return {
        label: status || "Không rõ",
        classes: "bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB]"
      };
  }
};

export const getEventStatusMeta = (status) => {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return {
        label: "Đang diễn ra",
        classes: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
      };
    case "COMING":
      return {
        label: "Sắp diễn ra",
        classes: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
      };
    case "ENDED":
      return {
        label: "Đã kết thúc",
        classes: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
      };
    default:
      return {
        label: status || "Không rõ",
        classes: "bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB]"
      };
  }
};

