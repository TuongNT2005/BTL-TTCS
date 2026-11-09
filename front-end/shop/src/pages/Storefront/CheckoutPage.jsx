import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import orderService from "../../services/orderService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { formatVND, resolveImageUrl } from "../../utils/formatters";
import { FiCheckCircle, FiShield, FiArrowLeft } from "react-icons/fi";

export const CheckoutPage = () => {
  const { user, refreshProfile } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showToast } = useUI();
  const navigate = useNavigate();

  // Form states
  const [receiverName, setReceiverName] = useState(user?.username || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.phone || "");
  const [receiverAddress, setReceiverAddress] = useState(user?.address || "");
  const [coinUsed, setCoinUsed] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (user) {
      if (!receiverName && user.username) setReceiverName(user.username);
      if (!receiverPhone && user.phone) setReceiverPhone(user.phone);
      if (!receiverAddress && user.address) setReceiverAddress(user.address);
    }
  }, [user]);

  const userCoins = user?.coin || 0;
  const shippingFee = totalPrice >= 1000000 || totalPrice === 0 ? 0 : 30000;
  const maxCoinsAllowed = Math.min(userCoins, totalPrice);
  const safeCoinUsed = Math.min(Math.max(0, Number(coinUsed) || 0), maxCoinsAllowed);
  const finalTotal = Math.max(0, totalPrice - safeCoinUsed + shippingFee);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast("Giỏ hàng của bạn đang trống", "error");
      return;
    }
    if (!receiverName.trim() || !receiverPhone.trim() || !receiverAddress.trim()) {
      showToast("Vui lòng điền đầy đủ thông tin giao nhận", "error");
      return;
    }

    try {
      setSubmitting(true);

      const itemsPayload = cartItems.map((item) => ({
        productVariantId: item.productVariantId || item.id,
        quantity: item.quantity || 1,
      }));

      const res = await orderService.createOrder({
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        receiverAddress: receiverAddress.trim(),
        coinUsed: safeCoinUsed,
        items: itemsPayload,
      });

      const orderId = res?.data;
      showToast("Tạo đơn hàng thành công!", "success");
      setCreatedOrder({ id: orderId, total: finalTotal });
      clearCart();
      refreshProfile?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể khởi tạo đơn hàng";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayOrder = async () => {
    if (!createdOrder?.id) return;
    try {
      setPaying(true);
      await orderService.payOrder(createdOrder.id);
      showToast("Thanh toán đơn hàng thành công!", "success");
      navigate("/customer/orders");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Thanh toán thất bại";
      showToast(msg, "error");
    } finally {
      setPaying(false);
    }
  };

  // If order was created, show confirmation & payment step
  if (createdOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center mx-auto mb-5">
          <FiCheckCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-[#6B706E] uppercase tracking-wider block mb-1">
          Mã Đơn Hàng #{createdOrder.id}
        </span>
        <h2 className="font-editorial text-3xl font-medium text-[#121316] mb-3">
          Đơn Hàng Đã Được Tiếp Nhận
        </h2>
        <p className="text-sm text-[#6B706E] mb-8 max-w-md mx-auto leading-relaxed">
          Cảm ơn bạn đã lựa chọn thiết kế của ATELIER. Bạn có thể thanh toán trực tuyến ngay để chúng tôi tiến hành đóng gói và giao hàng sớm nhất.
        </p>

        <div className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] max-w-md mx-auto mb-8 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6B706E]">Người nhận:</span>
            <span className="font-medium text-[#121316]">{receiverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B706E]">Số điện thoại:</span>
            <span className="font-mono text-[#121316]">{receiverPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B706E]">Địa chỉ giao:</span>
            <span className="font-medium text-[#121316] truncate max-w-xs">{receiverAddress}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E6E4DF] text-sm">
            <span className="font-medium text-[#121316]">Tổng thanh toán:</span>
            <span className="font-mono font-semibold text-[#121316]">
              {formatVND(createdOrder.total)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            loading={paying}
            onClick={handlePayOrder}
            className="w-full sm:w-auto"
          >
            Xác nhận thanh toán ngay
          </Button>

          <Link to="/customer/orders">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Xem danh sách đơn hàng
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-editorial text-2xl font-medium text-[#121316] mb-3">
          Túi đồ của bạn đang trống
        </h2>
        <p className="text-xs text-[#6B706E] mb-6">
          Vui lòng chọn sản phẩm vào giỏ trước khi tiến hành thanh toán.
        </p>
        <Link to="/catalog">
          <Button variant="primary">Khám phá sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-[#6B706E] hover:text-[#121316] transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      <div className="pb-6 border-b border-[#E6E4DF] mb-8">
        <span className="text-xs font-mono text-[#6B706E] uppercase tracking-wider block mb-1">
          Hoàn Tất Đơn Hàng
        </span>
        <h1 className="font-editorial text-3xl font-medium text-[#121316]">
          Thanh Toán &amp; Giao Hàng
        </h1>
      </div>

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery Info & Coin Deduction (8 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Section: Delivery Details */}
          <div className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex flex-col gap-4">
            <h3 className="font-editorial text-lg font-medium text-[#121316] pb-3 border-b border-[#E6E4DF]">
              Thông Tin Người Nhận
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ và tên người nhận"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
              <Input
                label="Số điện thoại liên hệ"
                required
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="0901234567"
              />
            </div>

            <Input
              label="Địa chỉ giao nhận chi tiết"
              required
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="Số nhà, ngõ/ngách, tên đường, phường/xã, quận/huyện..."
            />
          </div>

          {/* Section: Coin Rewards Deduction */}
          <div className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DF]">
              <h3 className="font-editorial text-lg font-medium text-[#121316]">
                Áp Dụng Xu Thưởng (Atelier Coin)
              </h3>
              <span className="text-xs font-mono font-medium text-[#B45309]">
                Khả dụng: {userCoins.toLocaleString()} xu
              </span>
            </div>

            <p className="text-xs text-[#6B706E] leading-relaxed">
              Quy đổi: 1 xu = 1 ₫ giảm trừ trực tiếp vào đơn hàng.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={maxCoinsAllowed}
                value={coinUsed}
                onChange={(e) => setCoinUsed(Number(e.target.value) || 0)}
                placeholder="Nhập số xu muốn dùng..."
                className="w-full text-sm bg-white border border-[#E6E4DF] rounded-[2px] px-3.5 py-2 text-[#121316] focus:outline-none focus:border-[#121316]"
              />
              <button
                type="button"
                onClick={() => setCoinUsed(maxCoinsAllowed)}
                className="px-4 py-2 text-xs font-medium border border-[#121316] bg-white text-[#121316] hover:bg-[#121316] hover:text-white rounded-[2px] transition-colors cursor-pointer shrink-0"
              >
                Dùng tối đa
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary: Items & Total (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex flex-col gap-6 sticky top-24">
            <h3 className="font-editorial text-lg font-medium text-[#121316] pb-3 border-b border-[#E6E4DF]">
              Tóm Tắt Đơn Hàng ({cartItems.length} mẫu)
            </h3>

            {/* Items list */}
            <div className="flex flex-col divide-y divide-[#E6E4DF] max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const unitPrice = item.price || item.productVariantPrice || 0;
                const img = item.productImg || item.img || item.productImage;
                return (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img
                      src={resolveImageUrl(img)}
                      alt={item.productName}
                      className="w-12 h-16 object-cover bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#121316] truncate">
                        {item.productName || "Sản phẩm"}
                      </p>
                      <p className="text-[11px] text-[#6B706E]">
                        Size: {item.size || "—"} · Màu: {item.color || "—"} · x{item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#121316]">
                      {formatVND(unitPrice * (item.quantity || 1))}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#E6E4DF] text-xs">
              <div className="flex justify-between text-[#6B706E]">
                <span>Tạm tính tiền hàng</span>
                <span className="font-mono text-[#121316]">{formatVND(totalPrice)}</span>
              </div>

              {safeCoinUsed > 0 && (
                <div className="flex justify-between text-[#B45309]">
                  <span>Trừ xu thưởng ({safeCoinUsed.toLocaleString()} xu)</span>
                  <span className="font-mono">-{formatVND(safeCoinUsed)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6B706E]">
                <span>Phí vận chuyển</span>
                <span className="font-mono text-[#121316]">
                  {shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-[#E6E4DF] text-sm">
                <span className="font-medium text-[#121316]">Tổng thanh toán</span>
                <span className="font-mono text-lg font-bold text-[#121316]">
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-2"
            >
              Xác Nhận Đặt Hàng
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B706E]">
              <FiShield className="w-3.5 h-3.5" />
              <span>Giao dịch an toàn &amp; Bảo mật thông tin</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

