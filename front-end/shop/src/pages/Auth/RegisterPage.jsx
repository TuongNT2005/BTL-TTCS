import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { FiLock, FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft } from "react-icons/fi";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg("Vui lòng điền các thông tin bắt buộc (*).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        comfirmPassword: formData.confirmPassword,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      if (res.success) {
        navigate("/login");
      } else {
        setErrorMsg(res.error || "Đăng ký không thành công. Hãy thử lại!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Return home link */}
      <div className="max-w-lg w-full mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B706E] hover:text-[#121316] transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ ATELIER</span>
        </Link>
      </div>

      <div className="max-w-lg w-full mx-auto bg-white border border-[#E6E4DF] p-8 sm:p-10 rounded-[2px] shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-editorial text-3xl font-bold tracking-widest text-[#121316] block uppercase mb-2"
          >
            ATELIER
          </Link>
          <p className="text-xs text-[#6B706E] uppercase tracking-wider">
            Gia Nhập Cộng Đồng Khách Hàng Thân Thiết
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
            name="username"
            icon={FiUser}
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Ví dụ: myusername"
          />

          <Input
            label="Địa chỉ email"
            type="email"
            name="email"
            icon={FiMail}
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              icon={FiLock}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              icon={FiLock}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Số điện thoại"
              name="phone"
              icon={FiPhone}
              value={formData.phone}
              onChange={handleChange}
              placeholder="0901234567"
            />
            <Input
              label="Địa chỉ"
              name="address"
              icon={FiMapPin}
              value={formData.address}
              onChange={handleChange}
              placeholder="Hà Nội, TP.HCM..."
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            className="w-full mt-3"
          >
            Tạo Tài Khoản
          </Button>
        </form>

        {/* Footer switch to Login */}
        <div className="mt-8 text-center text-xs text-[#6B706E]">
          Đã có tài khoản thành viên?{" "}
          <Link
            to="/login"
            className="text-[#121316] font-medium underline underline-offset-4 hover:text-[#6B706E]"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

