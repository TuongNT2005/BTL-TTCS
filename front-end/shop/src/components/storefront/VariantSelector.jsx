import React, { useMemo } from "react";

export const VariantSelector = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  // Extract distinct colors and sizes
  const colors = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => {
      if (v.color) set.add(v.color);
    });
    return Array.from(set);
  }, [variants]);

  const sizes = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => {
      if (v.size) set.add(v.size);
    });
    return Array.from(set);
  }, [variants]);

  // Determine current selected color and size
  const currentColor = selectedVariant?.color || colors[0] || "";
  const currentSize = selectedVariant?.size || sizes[0] || "";

  const handleColorChange = (newColor) => {
    // Try to find variant with newColor and currentSize, or any with newColor
    const match =
      variants.find((v) => v.color === newColor && v.size === currentSize) ||
      variants.find((v) => v.color === newColor);
    if (match) onSelectVariant(match);
  };

  const handleSizeChange = (newSize) => {
    const match =
      variants.find((v) => v.color === currentColor && v.size === newSize) ||
      variants.find((v) => v.size === newSize);
    if (match) onSelectVariant(match);
  };

  const currentStock = selectedVariant?.quantity ?? selectedVariant?.stock ?? 0;

  return (
    <div className="flex flex-col gap-5 py-4 border-y border-[#E6E4DF]">
      {/* Colors */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#121316]">Màu sắc</span>
            <span className="text-[#6B706E]">{currentColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const isSelected = currentColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorChange(c)}
                  className={`px-3.5 py-1.5 text-xs font-medium border rounded-[2px] transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#121316] bg-[#121316] text-white"
                      : "border-[#E6E4DF] bg-white text-[#121316] hover:border-[#6B706E]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#121316]">Kích cỡ (Size)</span>
            <span className="text-[#6B706E]">{currentSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const isSelected = currentSize === s;
              const matchingVariant = variants.find(
                (v) => v.color === currentColor && v.size === s
              );
              const isAvailable =
                matchingVariant && (matchingVariant.quantity > 0 || matchingVariant.stock > 0);

              return (
                <button
                  key={s}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleSizeChange(s)}
                  className={`min-w-10 px-3 py-1.5 text-xs font-medium border rounded-[2px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:line-through ${
                    isSelected
                      ? "border-[#121316] bg-[#121316] text-white"
                      : "border-[#E6E4DF] bg-white text-[#121316] hover:border-[#6B706E]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status Indicator */}
      <div className="flex items-center gap-2 text-xs pt-1">
        {currentStock > 5 ? (
          <span className="inline-flex items-center gap-1.5 text-[#047857]">
            <span className="w-2 h-2 rounded-full bg-[#047857]" />
            Còn hàng ({currentStock} sản phẩm có sẵn)
          </span>
        ) : currentStock > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-[#B45309] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B45309]" />
            Chỉ còn {currentStock} chiếc — Đặt sớm kẻo lỡ
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[#8C2B2B]">
            <span className="w-2 h-2 rounded-full bg-[#8C2B2B]" />
            Hết hàng tại xưởng
          </span>
        )}
      </div>
    </div>
  );
};

export default VariantSelector;

