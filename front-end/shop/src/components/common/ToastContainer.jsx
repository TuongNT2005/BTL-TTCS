import React from "react";
import { useUI } from "../../context/UIContext";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export const ToastContainer = () => {
  const { toasts, removeToast } = useUI();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <FiCheckCircle className="w-4 h-4 text-[#047857] shrink-0" />,
    error: <FiAlertCircle className="w-4 h-4 text-[#8C2B2B] shrink-0" />,
    info: <FiInfo className="w-4 h-4 text-[#1D4ED8] shrink-0" />,
  };

  const borderStyles = {
    success: "border-l-4 border-l-[#047857]",
    error: "border-l-4 border-l-[#8C2B2B]",
    info: "border-l-4 border-l-[#1D4ED8]",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-white border border-[#E6E4DF] shadow-xl p-4 rounded-[2px] flex items-start justify-between gap-3 text-sm text-[#121316] animate-in slide-in-from-bottom-5 duration-200 ${
            borderStyles[toast.type] || borderStyles.info
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5">{icons[toast.type] || icons.info}</span>
            <span className="leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#6B706E] hover:text-[#121316] transition-colors p-0.5 cursor-pointer"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

