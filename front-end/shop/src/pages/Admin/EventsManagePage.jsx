import React, { useState, useEffect } from "react";
import eventService from "../../services/eventService";
import { useUI } from "../../context/UIContext";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { formatDate, getEventStatusMeta } from "../../utils/formatters";
import { FiPlus, FiEdit2, FiSearch } from "react-icons/fi";

const EVENT_STATUSES = ["AVAILABLE", "COMING", "ENDED"];

export const EventsManagePage = () => {
  const { showToast } = useUI();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    startAt: "",
    endAt: "",
    description: "",
    status: "AVAILABLE",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEvents({
        page,
        size: 10,
        keyword,
        status: "",
      });

      const pageData = res?.data;
      if (pageData) {
        setEvents(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      discount: "15",
      startAt: new Date().toISOString().split("T")[0],
      endAt: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      description: "",
      status: "AVAILABLE",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingEvent(ev);
    setFormData({
      name: ev.name || "",
      discount: ev.discount != null ? String(ev.discount) : "10",
      startAt: ev.startAt ? String(ev.startAt).split("T")[0] : "",
      endAt: ev.endAt ? String(ev.endAt).split("T")[0] : "",
      description: ev.description || "",
      status: ev.status || "AVAILABLE",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập tên sự kiện", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        discount: Number(formData.discount) || 0,
        startAt: formData.startAt,
        endAt: formData.endAt,
        description: formData.description.trim(),
        status: formData.status,
      };

      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, payload);
        showToast("Cập nhật sự kiện khuyến mãi thành công!", "success");
      } else {
        await eventService.createEvent(payload);
        showToast("Tạo sự kiện khuyến mãi mới thành công!", "success");
      }

      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Thao tác thất bại";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-medium text-[#121316]">
            Chiến Dịch Khuyến Mãi &amp; Sự Kiện
          </h1>
          <p className="text-xs text-[#6B706E] mt-0.5">
            Quản lý các chương trình chiết khấu, tuần lễ lookbook và giảm giá theo mùa.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={handleOpenCreate}
        >
          Tạo sự kiện mới
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm theo tên sự kiện..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-2 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
          />
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3">Mã</th>
                <th className="px-6 py-3">Tên chiến dịch</th>
                <th className="px-6 py-3">Chiết khấu</th>
                <th className="px-6 py-3">Bắt đầu</th>
                <th className="px-6 py-3">Kết thúc</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Đang tải danh sách sự kiện...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Chưa có sự kiện khuyến mãi nào.
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const statusMeta = getEventStatusMeta(ev.status);
                  return (
                    <tr key={ev.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                        #EV-{ev.id}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-[#121316]">
                        {ev.name}
                      </td>
                      <td className="px-6 py-3.5 font-mono font-semibold text-[#8C2B2B]">
                        -{ev.discount || 0}%
                      </td>
                      <td className="px-6 py-3.5 text-[#6B706E]">
                        {formatDate(ev.startAt)}
                      </td>
                      <td className="px-6 py-3.5 text-[#6B706E]">
                        {formatDate(ev.endAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-[2px] ${statusMeta.classes}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1.5 text-[#121316] hover:text-[#6B706E] border border-[#E6E4DF] rounded-[2px] hover:border-[#121316] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                        >
                          <FiEdit2 className="w-3 h-3" />
                          <span>Chỉnh sửa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-[#E6E4DF]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? "Cập Nhật Chiến Dịch" : "Tạo Sự Kiện Mới"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Tên chiến dịch sự kiện"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Tuần Lễ Lookbook Thu Đông"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tỷ lệ giảm giá (%)"
              type="number"
              min={1}
              max={99}
              required
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
              placeholder="15"
            />
            <Select
              label="Trạng thái"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={EVENT_STATUSES}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ngày bắt đầu"
              type="date"
              required
              value={formData.startAt}
              onChange={(e) =>
                setFormData({ ...formData, startAt: e.target.value })
              }
            />
            <Input
              label="Ngày kết thúc"
              type="date"
              required
              value={formData.endAt}
              onChange={(e) =>
                setFormData({ ...formData, endAt: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#121316]">
              Mô tả chiến dịch
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nội dung, điều kiện áp dụng..."
              className="w-full text-sm bg-white border border-[#E6E4DF] rounded-[2px] p-2.5 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E4DF] mt-2">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingEvent ? "Lưu thay đổi" : "Tạo sự kiện"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventsManagePage;

