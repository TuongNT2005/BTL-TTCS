import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import productService from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import VariantSelector from "../../components/storefront/VariantSelector";
import ReviewSection from "../../components/storefront/ReviewSection";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import { formatVND, resolveImageUrl } from "../../utils/formatters";
import { FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiCheck } from "react-icons/fi";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useUI();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductDetail(id);
        const data = res?.data;
        if (data) {
          setProduct(data);
          const variants = data.productVariants || data.variants || [];
          if (variants.length > 0) {
            setSelectedVariant(variants[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load product detail", err);
        showToast("Không tìm thấy thông tin sản phẩm", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, showToast]);

  const handleAddToCart = async (openDrawer = true) => {
    if (!selectedVariant) {
      showToast("Vui lòng chọn biến thể kích cỡ / màu sắc", "error");
      return false;
    }
    const stock = selectedVariant.quantity ?? selectedVariant.stock ?? 0;
    if (stock <= 0) {
      showToast("Sản phẩm này hiện đang hết hàng", "error");
      return false;
    }

    try {
      setAdding(true);
      const res = await addToCart(selectedVariant.id, quantity, openDrawer);
      return res.success;
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart(false);
    if (success) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-editorial text-2xl font-medium text-[#121316] mb-3">
          Sản phẩm không tồn tại hoặc đã ngừng kinh doanh
        </h2>
        <Link to="/catalog" className="text-xs underline text-[#6B706E]">
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const variants = product.productVariants || product.variants || [];
  const currentPrice = selectedVariant?.price || product.price || 0;
  const originalPrice = product.originalPrice;
  const discount =
    originalPrice && currentPrice < originalPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const currentStock = selectedVariant?.quantity ?? selectedVariant?.stock ?? 0;
  const isOutOfStock = currentStock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-[#6B706E] hover:text-[#121316] transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Product Image */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] w-full bg-[#F9F9F8] border border-[#E6E4DF] rounded-[2px] overflow-hidden">
            <img
              src={resolveImageUrl(product.img || product.image)}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-xs font-mono tracking-widest text-[#6B706E] uppercase mb-1.5">
            {product.category || "Atelier Ready-to-Wear"}
          </span>

          {/* Title */}
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#121316] mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-2xl font-semibold text-[#121316]">
              {formatVND(currentPrice)}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="font-mono text-sm text-[#6B706E] line-through">
                {formatVND(originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 bg-[#8C2B2B] text-white rounded-[2px]">
                -{discount}%
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-[#6B706E] leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Variant Selector (Colors & Sizes) */}
          {variants.length > 0 && (
            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          )}

          {/* Quantity Controls & Action Buttons */}
          <div className="flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-[#121316]">Số lượng</span>
              <div className="flex items-center border border-[#E6E4DF] rounded-[2px] bg-white">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#6B706E] hover:text-[#121316] hover:bg-[#F9F9F8] disabled:opacity-30 cursor-pointer"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-mono font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= currentStock || isOutOfStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#6B706E] hover:text-[#121316] hover:bg-[#F9F9F8] disabled:opacity-30 cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                icon={FiShoppingBag}
                disabled={isOutOfStock || adding}
                loading={adding}
                onClick={() => handleAddToCart(true)}
              >
                {isOutOfStock ? "Hết hàng" : "Thêm vào túi đồ"}
              </Button>

              <Button
                variant="primary"
                size="lg"
                disabled={isOutOfStock || adding}
                onClick={handleBuyNow}
              >
                {isOutOfStock ? "Tạm hết hàng" : "Mua ngay"}
              </Button>
            </div>
          </div>

          {/* Highlights / Care instructions */}
          <div className="mt-10 pt-6 border-t border-[#E6E4DF] flex flex-col gap-2.5 text-xs text-[#6B706E]">
            <div className="flex items-center gap-2">
              <FiCheck className="text-[#047857] w-4 h-4 shrink-0" />
              <span>Chất liệu vải sợi tự nhiên cao cấp, thoáng mát bốn mùa.</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-[#047857] w-4 h-4 shrink-0" />
              <span>Giao hàng tiêu chuẩn 2-3 ngày, hỗ trợ thử đồ tại nhà.</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-[#047857] w-4 h-4 shrink-0" />
              <span>Đổi trả thuận tiện trong vòng 7 ngày qua cổng khách hàng.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Comments Section */}
      <ReviewSection productId={id} />
    </div>
  );
};

export default ProductDetailPage;

