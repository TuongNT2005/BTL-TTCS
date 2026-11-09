import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { FiLock, FiUser, FiArrowLeft } from "react-icons/fi";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await login(username.trim(), password);
      if (res.success) {
        if (res.user?.role?.toUpperCase().includes("ADMIN")) {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErrorMsg(res.error || "Tài khoản hoặc mật khẩu không chính xác.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Return home link */}
      <div className="max-w-md w-full mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B706E] hover:text-[#121316] transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ ATELIER</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto bg-white border border-[#E6E4DF] p-8 sm:p-10 rounded-[2px] shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-editorial text-3xl font-bold tracking-widest text-[#121316] block uppercase mb-2"
          >
            ATELIER
          </Link>
          <p className="text-xs text-[#6B706E] uppercase tracking-wider">
            Đăng Nhập Tài Khoản Thành Viên
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[2px] text-xs text-[#8C2B2B]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Tên đăng nhập (Username)"
            icon={FiUser}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ví dụ: user01 hoặc admin01"
            autoComplete="username"
          />

          <Input
            label="Mật khẩu"
            type="password"
            icon={FiLock}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            className="w-full mt-2"
          >
            Đăng Nhập
          </Button>
        </form>

        {/* Demo fast-fill shortcuts for convenience */}
        <div className="mt-6 pt-5 border-t border-[#E6E4DF] flex flex-col gap-2">
          <span className="text-[11px] text-[#6B706E] uppercase tracking-wider text-center">
            Tài Khoản Thử Nghiệm (Demo)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("user01", "1234567")}
              className="px-2.5 py-1.5 border border-[#E6E4DF] bg-[#F9F9F8] hover:border-[#121316] text-[11px] rounded-[2px] text-[#121316] transition-colors cursor-pointer"
            >
              Khách hàng: <span className="font-mono font-medium">user01</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin01", "1234567")}
              className="px-2.5 py-1.5 border border-[#E6E4DF] bg-[#F9F9F8] hover:border-[#121316] text-[11px] rounded-[2px] text-[#121316] transition-colors cursor-pointer"
            >
              Quản trị: <span className="font-mono font-medium">admin01</span>
            </button>
          </div>
        </div>

        {/* Footer switch to Register */}
        <div className="mt-8 text-center text-xs text-[#6B706E]">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-[#121316] font-medium underline underline-offset-4 hover:text-[#6B706E]"
          >
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

