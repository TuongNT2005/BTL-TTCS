import React from "react";

export const Badge = ({
  children,
  variant = "default",
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  }[size] || "px-2.5 py-0.5 text-xs";

  const variantClasses = {
    default: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]",
    dark: "bg-[#121316] text-white border-[#121316]",
    amber: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    blue: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
    emerald: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
    crimson: "bg-[#FEF2F2] text-[#8C2B2B] border-[#FECACA]",
  }[variant] || "";

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-[2px] tracking-wide uppercase select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

