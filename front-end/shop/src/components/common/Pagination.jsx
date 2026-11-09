import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex items-center justify-center gap-1.5 py-6 select-none ${className}`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 flex items-center justify-center border border-[#E6E4DF] bg-white text-[#121316] rounded-[2px] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#121316] transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-xs text-[#6B706E]"
            >
              ···
            </span>
          );
        }

        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 flex items-center justify-center text-xs font-medium rounded-[2px] transition-colors cursor-pointer border ${
              isActive
                ? "bg-[#121316] text-white border-[#121316]"
                : "bg-white text-[#121316] border-[#E6E4DF] hover:border-[#121316]"
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 flex items-center justify-center border border-[#E6E4DF] bg-white text-[#121316] rounded-[2px] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#121316] transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;

