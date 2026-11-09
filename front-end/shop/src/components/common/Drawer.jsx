import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121316]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen ${width} bg-white border-l border-[#E6E4DF] shadow-2xl flex flex-col z-10 transition-transform duration-300`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6E4DF]">
            <h3 className="font-editorial text-xl font-medium text-[#121316]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-[#6B706E] hover:text-[#121316] transition-colors p-1.5 cursor-pointer rounded-[2px]"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;

