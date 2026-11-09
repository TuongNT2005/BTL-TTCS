import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import Drawer from "../common/Drawer";
import Button from "../common/Button";
import { formatVND, resolveImageUrl } from "../../utils/formatters";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUI();
  const { cartItems, totalPrice, updateQuantity, removeItems, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Drawer isOpen={isCartOpen} onClose={closeCart} title="Túi Mua Sắm">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6E4DF]/40 flex items-center justify-center mb-4 text-[#6B706E]">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="font-editorial text-lg font-medium text-[#121316] mb-1">
            Túi đồ của bạn đang trống
          </h4>
          <p className="text-sm text-[#6B706E] mb-6 max-w-xs">
            Khám phá những thiết kế may mặc đương đại mới nhất trong bộ sưu tập.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              closeCart();
              navigate("/catalog");
            }}
          >
            Khám phá sản phẩm
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Item List */}
          <div className="flex flex-col divide-y divide-[#E6E4DF] -mx-6 px-6">
            {cartItems.map((item) => {
              const unitPrice = item.price || item.productVariantPrice || 0;
              const img = item.productImg || item.img || item.productImage;

              return (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <img
                    src={resolveImageUrl(img)}
                    alt={item.productName || "Sản phẩm"}
                    className="w-20 h-24 object-cover bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-[#121316] line-clamp-1">
                      {item.productName || "Sản phẩm may mặc"}
                    </h5>
                    <p className="text-xs text-[#6B706E] mt-0.5">
                      Màu: {item.color || "Tiêu chuẩn"} · Size: {item.size || "Free"}
                    </p>
                    <p className="text-xs font-mono font-medium text-[#121316] mt-2">
                      {formatVND(unitPrice)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-[#E6E4DF] rounded-[2px] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6B706E] hover:text-[#121316] hover:bg-[#F9F9F8] transition-colors cursor-pointer"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-medium">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6B706E] hover:text-[#121316] hover:bg-[#F9F9F8] transition-colors cursor-pointer"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItems([item.id])}
                        className="text-[#6B706E] hover:text-[#8C2B2B] text-xs p-1.5 transition-colors cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer & Checkout CTA */}
          <div className="pt-6 border-t border-[#E6E4DF] mt-6">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-[#6B706E]">Tạm tính</span>
              <span className="font-mono text-base font-semibold text-[#121316]">
                {formatVND(totalPrice)}
              </span>
            </div>
            <p className="text-xs text-[#6B706E] mb-4">
              Phí vận chuyển và chiết khấu Xu sẽ được tính tại bước thanh toán.
            </p>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              disabled={loading}
            >
              Tiến hành thanh toán
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;

