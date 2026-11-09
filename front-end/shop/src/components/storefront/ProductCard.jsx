import React from "react";
import { Link } from "react-router-dom";
import { formatVND, resolveImageUrl } from "../../utils/formatters";

export const ProductCard = ({ product }) => {
  if (!product) return null;

  const id = product.id || product.productId;
  const name = product.name || product.productName || "Thiết Kế May Mặc";
  const category = product.category || product.categoryName || "Ready-to-Wear";
  const price = product.price || product.basePrice || product.minPrice || 0;
  const originalPrice = product.originalPrice;
  const discount = product.discount || (originalPrice && price < originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const img = product.img || product.image || product.productImg;

  return (
    <div className="group flex flex-col">
      {/* 3:4 Lookbook Image Container */}
      <Link
        to={`/products/${id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px]"
      >
        <img
          src={resolveImageUrl(img)}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Discount Tag */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#8C2B2B] text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-[2px] tracking-wider">
            -{discount}%
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-full bg-[#121316]/90 backdrop-blur-xs text-white text-xs font-medium py-2.5 text-center rounded-[2px] shadow-md hover:bg-[#121316]">
            Xem chi tiết
          </div>
        </div>
      </Link>

      {/* Meta */}
      <div className="flex flex-col pt-3 pb-1">
        <span className="text-[11px] text-[#6B706E] tracking-wider uppercase mb-1">
          {category}
        </span>
        <Link
          to={`/products/${id}`}
          className="text-sm font-medium text-[#121316] line-clamp-1 hover:text-[#6B706E] transition-colors"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-mono font-semibold text-[#121316]">
            {formatVND(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs font-mono text-[#6B706E] line-through">
              {formatVND(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

