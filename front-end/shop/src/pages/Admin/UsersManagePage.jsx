import React, { useState, useEffect } from "react";
import userService from "../../services/userService";
import Pagination from "../../components/common/Pagination";
import { FiSearch, FiUser } from "react-icons/fi";

export const UsersManagePage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.searchUsersAdmin({
        page,
        size: 10,
        keyword,
      });

      const pageData = res?.data;
      if (pageData) {
        setUsers(pageData.content || pageData || []);
        setTotalPages(pageData.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF]">
        <h1 className="font-editorial text-2xl font-medium text-[#121316]">
          Quản Lý Người Dùng
        </h1>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Danh sách tài khoản khách hàng, quyền hạn và số dư xu tích lũy trong hệ thống.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm theo username..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full text-xs bg-white border border-[#E6E4DF] rounded-[2px] pl-8 pr-3 py-2 text-[#121316] placeholder:text-[#6B706E]/60 focus:outline-none focus:border-[#121316]"
          />
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B706E]" />
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E6E4DF] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9F8] border-b border-[#E6E4DF] text-[#6B706E] uppercase font-mono">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Tên đăng nhập</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Số điện thoại</th>
                <th className="px-6 py-3">Địa chỉ</th>
                <th className="px-6 py-3">Quyền hạn</th>
                <th className="px-6 py-3 text-right">Xu tích lũy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6B706E]">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9F9F8]/60 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                      #{u.id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-[#121316]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#121316] text-white flex items-center justify-center font-editorial text-[10px]">
                          {u.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span>{u.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[#6B706E]">
                      {u.email || "—"}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[#6B706E]">
                      {u.phone || "—"}
                    </td>
                    <td className="px-6 py-3.5 text-[#6B706E] max-w-xs truncate">
                      {u.address || "—"}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11px]">
                      <span className="px-2 py-0.5 border border-[#E6E4DF] bg-[#F9F9F8] rounded-[2px]">
                        {u.role || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-medium text-[#B45309] text-right">
                      {(u.coin || 0).toLocaleString()} xu
                    </td>
                  </tr>
                ))
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
    </div>
  );
};

export default UsersManagePage;

