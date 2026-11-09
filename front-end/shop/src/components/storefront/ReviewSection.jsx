import React, { useState, useEffect } from "react";
import commentService from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import Button from "../common/Button";
import { formatDate } from "../../utils/formatters";
import { FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

export const ReviewSection = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useUI();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [star, setStar] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentService.getComments(productId);
      const list = res?.data || [];
      setComments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá", "error");
      return;
    }

    try {
      setSubmitting(true);
      await commentService.createComment(productId, { star, content });
      showToast("Đã gửi đánh giá thành công!", "success");
      setContent("");
      setStar(5);
      fetchComments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể gửi nhận xét";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, c) => sum + (c.star || 5), 0) / comments.length
        ).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-8 pt-10 border-t border-[#E6E4DF]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl font-medium text-[#121316]">
            Đánh Giá &amp; Nhận Xét
          </h3>
          <p className="text-sm text-[#6B706E] mt-0.5">
            Cảm nhận thực tế từ khách hàng đã trải nghiệm sản phẩm.
          </p>
        </div>

        {averageRating && (
          <div className="flex items-center gap-3 bg-white border border-[#E6E4DF] px-4 py-2 rounded-[2px] w-fit">
            <span className="font-editorial text-2xl font-semibold text-[#121316]">
              {averageRating}
            </span>
            <div className="flex flex-col">
              <div className="flex text-[#B45309]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(Number(averageRating))
                        ? "text-[#B45309]"
                        : "text-[#E6E4DF]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#6B706E]">
                Dựa trên {comments.length} nhận xét
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E6E4DF] p-5 rounded-[2px] flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#121316]">
              Viết đánh giá của bạn
            </span>
            {/* Star Selector */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverStar(s)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setStar(s)}
                  className="p-1 text-[#B45309] hover:scale-110 transition-transform cursor-pointer"
                >
                  {(hoverStar || star) >= s ? (
                    <FaStar className="w-4 h-4" />
                  ) : (
                    <FiStar className="w-4 h-4 text-[#6B706E]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ về phom dáng, chất liệu vải, trải nghiệm sử dụng..."
            className="w-full text-sm bg-white border border-[#E6E4DF] rounded-[2px] p-3 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
            required
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              Gửi nhận xét
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-[#E6E4DF] p-4 text-center rounded-[2px] text-sm text-[#6B706E]">
          Vui lòng{" "}
          <span className="text-[#121316] font-medium underline">
            đăng nhập
          </span>{" "}
          để gửi đánh giá cho sản phẩm này.
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col divide-y divide-[#E6E4DF]">
        {loading ? (
          <div className="py-6 text-center text-sm text-[#6B706E]">
            Đang tải nhận xét...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#6B706E]">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="py-4.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-[#121316]">
                    {comment.username || "Khách hàng"}
                  </span>
                  <div className="flex text-[#B45309]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        className={`w-3 h-3 ${
                          s <= (comment.star || 5)
                            ? "text-[#B45309]"
                            : "text-[#E6E4DF]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-[#6B706E]">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-[#121316] leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

