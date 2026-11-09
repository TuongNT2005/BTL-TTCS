import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import userService from "../../services/userService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock } from "react-icons/fi";

export const ProfilePage = () => {
  const { user, updateUserProfile, refreshProfile } = useAuth();
  const { showToast } = useUI();

  // Profile edit state
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userService.updateProfile({
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
        avatar: profileData.avatar.trim() || null,
      });

      if (res?.data) {
        updateUserProfile(res.data);
      }
      showToast("Cập nhật thông tin cá nhân thành công!", "success");
      refreshProfile?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể cập nhật hồ sơ";
      showToast(msg, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast("Mật khẩu mới xác nhận không khớp", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("Mật khẩu mới phải có tối thiểu 6 ký tự", "error");
      return;
    }

    try {
      setSavingPassword(true);
      await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      showToast("Đổi mật khẩu thành công!", "success");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Đổi mật khẩu thất bại";
      showToast(msg, "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="pb-4 border-b border-[#E6E4DF]">
        <h2 className="font-editorial text-2xl font-medium text-[#121316]">
          Hồ Sơ Cá Nhân
        </h2>
        <p className="text-xs text-[#6B706E] mt-0.5">
          Quản lý thông tin liên hệ và bảo mật tài khoản thành viên.
        </p>
      </div>

      {/* Coin Balance Highlight Card */}
      <div className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#6B706E] uppercase tracking-wider block mb-1">
            Số Dư Xu Thưởng Hiện Có
          </span>
          <span className="font-mono text-3xl font-bold text-[#B45309]">
            {(user?.coin || 0).toLocaleString()} <span className="text-sm font-sans font-normal text-[#121316]">xu</span>
          </span>
        </div>
        <p className="text-xs text-[#6B706E] max-w-xs text-right hidden sm:block">
          Xu thưởng được tích lũy tự động sau mỗi đơn hàng và có thể dùng để thanh toán trừ trực tiếp.
        </p>
      </div>

      {/* Update Contact Info Form */}
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex flex-col gap-5"
      >
        <h3 className="font-editorial text-lg font-medium text-[#121316] pb-3 border-b border-[#E6E4DF]">
          Thông Tin Cơ Bản
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên đăng nhập"
            icon={FiUser}
            disabled
            value={profileData.username}
          />
          <Input
            label="Địa chỉ email"
            icon={FiMail}
            disabled
            value={profileData.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Số điện thoại"
            icon={FiPhone}
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            placeholder="0901234567"
          />
          <Input
            label="Địa chỉ giao nhận mặc định"
            icon={FiMapPin}
            value={profileData.address}
            onChange={(e) =>
              setProfileData({ ...profileData, address: e.target.value })
            }
            placeholder="Hà Nội, TP.HCM..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" loading={savingProfile}>
            Lưu thay đổi
          </Button>
        </div>
      </form>

      {/* Change Password Form */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white border border-[#E6E4DF] p-6 rounded-[2px] flex flex-col gap-5"
      >
        <h3 className="font-editorial text-lg font-medium text-[#121316] pb-3 border-b border-[#E6E4DF]">
          Đổi Mật Khẩu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            icon={FiLock}
            required
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
            placeholder="••••••••"
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            icon={FiLock}
            required
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            placeholder="••••••••"
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            icon={FiLock}
            required
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmNewPassword: e.target.value,
              })
            }
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="outline" loading={savingPassword}>
            Cập nhật mật khẩu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

